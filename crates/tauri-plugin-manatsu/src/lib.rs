mod command;
mod error;
pub mod log;

pub use error::Error;
pub use log::{Log, VersionSnapshot};

use error::Result;
use log::LogCache;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::sync::Mutex;
use tauri::plugin::{Builder, TauriPlugin};
use tauri::{AppHandle, Manager, RunEvent, Runtime};

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

pub trait AppHandleExt {
  fn write_logs_to_disk(&self) -> Result<()>;
}

impl<R: Runtime> AppHandleExt for AppHandle<R> {
  fn write_logs_to_disk(&self) -> Result<()> {
    Log::write_to_disk(self)
  }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct Manatsu {
  dev: bool,
}

impl Default for Manatsu {
  fn default() -> Self {
    Self { dev: tauri::is_dev() }
  }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  let manatsu = json!(Manatsu::default());
  let script = format!("(()=>{{globalThis.MANATSU={manatsu}}})();",);

  Builder::new("manatsu")
    .js_init_script(script)
    .invoke_handler(tauri::generate_handler![
      command::is_dev,
      command::manatsu_version,
      command::save_log,
      command::version_snapshot,
    ])
    .setup(|app, _api| {
      app.manage(LogCache(Mutex::default()));
      Ok(())
    })
    .on_event(move |app, event| {
      if let RunEvent::Exit = event {
        let _ = Log::write_to_disk(app);
      }
    })
    .build()
}
