mod command;
mod error;
mod global;
pub mod log;

pub use error::Error;
pub use log::{Log, VersionSnapshot};

use error::Result;
use global::Manatsu;
use std::sync::Mutex;
use tauri::plugin::TauriPlugin;
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

struct PluginState {
  log_cache: Mutex<Vec<Log>>,
  log_cache_size: usize,
}

pub struct Builder {
  log_cache_size: usize,
}

impl Builder {
  pub fn new() -> Self {
    Self::default()
  }

  #[must_use]
  pub fn log_cache_size(mut self, size: usize) -> Self {
    self.log_cache_size = size;
    self
  }

  pub fn build<R: Runtime>(self) -> TauriPlugin<R> {
    let state = PluginState {
      log_cache: Mutex::default(),
      log_cache_size: self.log_cache_size,
    };

    tauri::plugin::Builder::new("manatsu")
      .js_init_script(Manatsu::script())
      .invoke_handler(tauri::generate_handler![
        command::is_dev,
        command::save_log,
        command::set_default_vue_version,
        command::version,
        command::version_snapshot,
      ])
      .setup(|app, _api| {
        app.manage(state);
        Ok(())
      })
      .on_event(move |app, event| {
        if let RunEvent::Exit = event {
          let _ = Log::write_to_disk(app);
        }
      })
      .build()
  }
}

impl Default for Builder {
  fn default() -> Self {
    Self { log_cache_size: 20 }
  }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::default().build()
}
