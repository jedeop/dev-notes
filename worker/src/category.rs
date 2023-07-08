use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub(crate) struct Category {
    name: String,
    short_title: String,
    long_title: String,
}

impl Category {
    pub(crate) fn name(&self) -> &str {
        self.name.as_ref()
    }
}
