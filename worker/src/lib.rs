use note::{Note, NoteInput};
use worker::*;

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
            let note_input = req.json::<NoteInput>().await?;
            let note = Note::from_input(note_input);

            let kv = ctx.kv("notes")?;

            kv.put(&note.id(), &note)?.execute().await?;

            Response::from_json(&note)
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
        .delete_async("/api/note/:id", |_req, ctx| async move {
            match ctx.param("id") {
                Some(id) => {
                    let kv = ctx.kv("notes")?;
                    kv.delete(id).await?;
                    Response::empty()
                }
                None => Response::error("Bad Request", 400)
            }
        })
        .run(req, env)
        .await
}
