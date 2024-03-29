use std::collections::HashMap;

use auth::{check_admin, Claims, Password, PasswordInput};
use category::Category;
use note::{Note, NoteInput};

use serde_json::json;
use worker::*;

mod auth;
mod category;
mod note;
mod utils;

fn log_request(req: &Request) {
    console_log!(
        "{} - [{}], located at: {:?}, within: {}",
        Date::now().to_string(),
        req.path(),
        req.cf().coordinates().unwrap_or_default(),
        req.cf().region().unwrap_or_else(|| "unknown region".into())
    );
}

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    log_request(&req);

    utils::set_panic_hook();

    let router = Router::new();

    router
        .post_async("/api/note", |mut req, ctx| async move {
            match check_admin(&req, &ctx).await {
                Ok(true) => {
                    let note_input = req.json::<NoteInput>().await?;
                    let note = Note::from(note_input);

                    let kv = ctx.kv("notes")?;

                    kv.put(note.id(), &note)?.execute().await?;

                    Response::from_json(&note)
                }
                Ok(false) => Response::error("Unauthorized", 401),
                Err(err) => {
                    console_error!("Internal Server Error at POST /api/note; {}", err);
                    Response::error("Internal Server Error", 500)
                }
            }
        })
        .get_async("/api/notes", |req, ctx| async move {
            let query: HashMap<String, String> = req.url()?.query_pairs().into_owned().collect();

            let limit = query
                .get("limit")
                .and_then(|s| s.parse::<u64>().ok())
                .unwrap_or(10);
            let cursor = query.get("cursor");
            let category = query.get("category");

            let kv = ctx.kv("notes")?;

            let builder = kv
                .list()
                .prefix(format!(
                    "note{}:",
                    category.map_or_else(String::new, |value| value.to_string()),
                ))
                .limit(limit);

            let builder = match cursor {
                Some(cursor) => builder.cursor(cursor.to_string()),
                None => builder,
            };

            let notes = builder.execute().await?;

            Response::from_json(&notes)
        })
        .get_async("/api/note/:id", |_req, ctx| async move {
            match ctx.param("id") {
                Some(id) => {
                    let kv = ctx.kv("notes")?;
                    match kv.get(id).json::<Note>().await? {
                        Some(note) => Response::from_json(&note),
                        None => Response::error("Not Found", 404),
                    }
                }
                None => Response::error("Bad Request", 400),
            }
        })
        .delete_async("/api/note/:id", |req, ctx| async move {
            match check_admin(&req, &ctx).await {
                Ok(true) => match ctx.param("id") {
                    Some(id) => {
                        let kv = ctx.kv("notes")?;
                        kv.delete(id).await?;
                        Response::empty()
                    }
                    None => Response::error("Bad Request", 400),
                },
                Ok(false) => Response::error("Unauthorized", 401),
                Err(err) => {
                    console_error!("Internal Server Error at DELETE /api/note/:id; {}", err);
                    Response::error("Internal Server Error", 500)
                }
            }
        })
        .post_async("/api/auth/hashpw", |mut req, _ctx| async move {
            let pw = req.json::<PasswordInput>().await?;
            match pw.to_password() {
                Ok(pw) => Response::from_json(&pw),
                Err(_) => Response::error("Internal Server Error", 500),
            }
        })
        .post_async("/api/auth/login", |mut req, ctx| async move {
            let pw = req.json::<PasswordInput>().await?;
            match (ctx.secret("ADMIN_PW"), ctx.secret("JWT_SECRET")) {
                (Ok(admin_pw), Ok(jwt_secret)) => {
                    let admin_pw = Password::new(admin_pw.to_string());
                    match admin_pw.check(pw.get()) {
                        Ok(true) => match Claims::admin().token(&jwt_secret.to_string()) {
                            Ok(token) => Response::from_json(&json!({ "token": token })),
                            Err(_) => Response::error("Internal Server Error", 500),
                        },
                        Ok(false) => Response::error("Bad Request", 400),
                        Err(_) => Response::error("Internal Server Error", 500),
                    }
                }
                _ => Response::error("No ADMIN_PW and/or JWT_SECRET", 500),
            }
        })
        .get_async("/api/auth/admin", |req, ctx| async move {
            match check_admin(&req, &ctx).await {
                Ok(admin) => Response::from_json(&json!({ "admin": admin })),
                Err(err) => {
                    console_error!("Internal Server Error at DELETE /api/note/:id; {}", err);
                    Response::error("Internal Server Error", 500)
                }
            }
        })
        .get_async("/api/category/:name", |_req, ctx| async move {
            match ctx.param("name") {
                Some(name) => {
                    let kv = ctx.kv("notes")?;
                    match kv
                        .get(&format!("category:{name}"))
                        .json::<Category>()
                        .await?
                    {
                        Some(category) => Response::from_json(&category),
                        None => Response::error("Not Found", 404),
                    }
                }
                None => Response::error("Bad Request", 400),
            }
        })
        .post_async("/api/category", |mut req, ctx| async move {
            match check_admin(&req, &ctx).await {
                Ok(true) => {
                    let category = req.json::<Category>().await?;

                    let kv = ctx.kv("notes")?;

                    kv.put(&format!("category:{}", category.name()), &category)?
                        .execute()
                        .await?;

                    Response::from_json(&category)
                }
                Ok(false) => Response::error("Unauthorized", 401),
                Err(err) => {
                    console_error!("Internal Server Error at POST /api/note; {}", err);
                    Response::error("Internal Server Error", 500)
                }
            }
        })
        .get_async("/api/categories", |_req, ctx| async move {
            let kv = ctx.kv("notes")?;

            let categories = kv.list().prefix("category:".to_string()).execute().await?;

            let category_names = categories
                .keys
                .iter()
                .map(|key| &key.name[9..])
                .collect::<Vec<&str>>();

            Response::from_json(&category_names)
        })
        .run(req, env)
        .await
}
