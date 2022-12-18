use auth::{Claims, Password, PasswordInput};
use note::{Note, NoteInput};

use worker::*;

mod auth;
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
            match ctx.var("JWT_SECRET") {
                Ok(secret) => match req.headers().get("Authorization")? {
                    Some(authorization) => {
                        let mut auth = authorization.split_whitespace();
                        match (auth.next(), auth.next()) {
                            (Some("Bearer"), Some(token)) => {
                                match Claims::verify(token, &secret.to_string()) {
                                    Ok(claims) => {
                                        if claims.get_admin() {
                                            // Real Logic
                                            let note_input = req.json::<NoteInput>().await?;
                                            let note = Note::from_input(note_input);

                                            let kv = ctx.kv("notes")?;

                                            kv.put(note.id(), &note)?.execute().await?;

                                            Response::from_json(&note)
                                        } else {
                                            Response::error("Unauthorized", 401)
                                        }
                                    }
                                    _ => Response::error("Unauthorized", 401),
                                }
                            }
                            _ => Response::error("Unauthorized", 401),
                        }
                    }
                    None => Response::error("Unauthorized", 401),
                },
                _ => Response::error("No JWT_SECRET", 500),
            }
        })
        .get_async("/api/notes", |_req, ctx| async move {
            let kv = ctx.kv("notes")?;

            let notes = kv
                .list()
                .prefix("note:".to_string())
                .limit(10)
                .execute()
                .await?;

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
            match ctx.var("JWT_SECRET") {
                Ok(secret) => match req.headers().get("Authorization")? {
                    Some(authorization) => {
                        let mut auth = authorization.split_whitespace();
                        match (auth.next(), auth.next()) {
                            (Some("Bearer"), Some(token)) => {
                                match Claims::verify(token, &secret.to_string()) {
                                    Ok(claims) => {
                                        if claims.get_admin() {
                                            // Real Logic
                                            match ctx.param("id") {
                                                Some(id) => {
                                                    let kv = ctx.kv("notes")?;
                                                    kv.delete(id).await?;
                                                    Response::empty()
                                                }
                                                None => Response::error("Bad Request", 400),
                                            }
                                        } else {
                                            Response::error("Unauthorized", 401)
                                        }
                                    }
                                    _ => Response::error("Unauthorized", 401),
                                }
                            }
                            _ => Response::error("Unauthorized", 401),
                        }
                    }
                    None => Response::error("Unauthorized", 401),
                },
                _ => Response::error("No JWT_SECRET", 500),
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
                            Ok(token) => Response::ok(token),
                            Err(_) => Response::error("Internal Server Error", 500),
                        },
                        Ok(false) => Response::error("Bad Request", 400),
                        Err(_) => Response::error("Internal Server Error", 500),
                    }
                }
                _ => Response::error("No ADMIN_PW and/or JWT_SECRET", 500),
            }
        })
        .run(req, env)
        .await
}
