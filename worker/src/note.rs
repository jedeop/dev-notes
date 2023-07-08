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
    pub(crate) fn id(&self) -> &str {
        self.id.as_ref()
    }
}
impl From<NoteInput> for Note {
    fn from(value: NoteInput) -> Self {
        let date = Utc::now().naive_local();
        let id = format!(
            "note{}:{}",
            value.category.unwrap_or_default(),
            99999999999999 - date.timestamp_millis()
        );
        Self {
            id,
            date,
            content: value.content,
            project: value.project,
            tags: value.tags,
        }
    }
}

#[derive(Deserialize)]
pub(crate) struct NoteInput {
    content: String,
    project: String,
    tags: Vec<String>,
    category: Option<String>,
}
