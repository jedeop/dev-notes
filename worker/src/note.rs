use chrono::{NaiveDateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub(crate) struct Note {
    id: String,
    date: NaiveDateTime,
    content: String,
    project: String,
    tags: Vec<String>,
}
impl Note {
    pub(crate) fn from_input(input: NoteInput) -> Self {
        let date = Utc::now().naive_local();
        let id = format!("note:{}", 99999999999999 - date.timestamp_millis());
        Self {
            id,
            date,
            content: input.content,
            project: input.project,
            tags: input.tags,
        }
    }

    pub(crate) fn id(&self) -> &str {
        self.id.as_ref()
    }
}

#[derive(Deserialize)]
pub(crate) struct NoteInput {
    content: String,
    project: String,
    tags: Vec<String>,
}
