use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct Manatsu {
  dev: bool,
}

impl Manatsu {
  pub fn script() -> String {
    let manatsu = json!(Self::default());
    format!("window.MANATSU={manatsu};")
  }
}

impl Default for Manatsu {
  fn default() -> Self {
    Self { dev: tauri::is_dev() }
  }
}
