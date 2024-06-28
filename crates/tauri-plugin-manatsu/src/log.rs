use crate::error::Result;
use chrono::{DateTime, FixedOffset, Local};
use serde::{Deserialize, Serialize};
use std::cmp::Ordering;
use std::fs;
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock};
use sysinfo::System;
use tauri::{AppHandle, Manager, Runtime};
use tracing::error;

pub mod date {
  use chrono::Local;

  /// <https://docs.rs/chrono/latest/chrono/format/strftime/index.html>
  pub const TIMESTAMP: &str = "%F %T%.3f %:z";

  pub fn now() -> String {
    Local::now().format(TIMESTAMP).to_string()
  }
}

pub const MAX_CACHE_SIZE: usize = 20;
static VUE_VERSION: OnceLock<String> = OnceLock::new();

pub(crate) struct LogCache(pub(crate) Mutex<Vec<Log>>);

#[derive(Default, Deserialize, Serialize, PartialEq, Eq)]
pub struct VersionSnapshot {
  pub app: Option<String>,
  pub manatsu: Option<String>,
  pub os: Option<String>,
  pub tauri: Option<String>,
  pub webview: Option<String>,
  pub vue: Option<String>,
}

impl VersionSnapshot {
  pub fn new() -> Self {
    Self {
      app: None,
      manatsu: Some(Self::manatsu()),
      tauri: Some(Self::tauri()),
      os: System::long_os_version(),
      webview: Self::webview(),
      vue: Self::vue(),
    }
  }

  pub fn manatsu() -> String {
    crate::VERSION.into()
  }

  pub fn os() -> Option<String> {
    System::long_os_version()
  }

  pub fn tauri() -> String {
    tauri::VERSION.into()
  }

  pub fn webview() -> Option<String> {
    tauri::webview_version().ok()
  }

  pub fn vue() -> Option<String> {
    VUE_VERSION.get().cloned()
  }
}

#[derive(Deserialize, Serialize, PartialEq, Eq)]
pub struct Log {
  pub name: String,
  pub message: String,
  pub stack: Option<String>,
  pub version: VersionSnapshot,
  pub timestamp: Option<String>,
}

impl Log {
  pub fn new(name: impl Into<String>, message: impl Into<String>) -> Self {
    Self {
      name: name.into(),
      message: message.into(),
      stack: None,
      version: VersionSnapshot::new(),
      timestamp: date::now().into(),
    }
  }

  fn path<R: Runtime>(app: &AppHandle<R>) -> Result<PathBuf> {
    let date = Local::now().format("%Y%m%d");
    let filename = format!("error.{date}.json");
    app
      .path()
      .app_log_dir()
      .map(|path| path.join(filename))
      .map_err(Into::into)
  }

  pub fn write_to_disk<R: Runtime>(app: &AppHandle<R>) -> Result<()> {
    let path = Self::path(app)?;
    if let Some(parent) = path.parent() {
      fs::create_dir_all(parent)?;
    }

    let logs = fs::read(&path).unwrap_or_default();
    let mut logs: Vec<Log> = serde_json::from_slice(&logs).unwrap_or_default();

    let cache = app.state::<LogCache>();
    let mut cache = cache.0.lock().unwrap();

    if !cache.is_empty() {
      for log in cache.drain(..) {
        logs.push(log);
      }

      cache.shrink_to_fit();
      drop(cache);

      logs.sort_unstable_by(|a, b| b.cmp(a));

      let logs = serde_json::to_vec_pretty(&logs)?;
      fs::write(path, logs)?;
    }

    Ok(())
  }

  pub fn save<R: Runtime>(mut self, app: &AppHandle<R>) -> Result<()> {
    if self.timestamp.is_none() {
      self.timestamp = date::now().into();
    }

    if self.version.manatsu.is_none() {
      self.version.manatsu = VersionSnapshot::manatsu().into();
    }

    if self.version.os.is_none() {
      self.version.os = VersionSnapshot::os();
    }

    if self.version.tauri.is_none() {
      self.version.tauri = VersionSnapshot::tauri().into();
    }

    if self.version.webview.is_none() {
      self.version.webview = VersionSnapshot::webview();
    }

    if let Some(vue) = self.version.vue.as_ref() {
      let _ = VUE_VERSION.set(vue.to_owned());
    } else {
      self.version.vue = VersionSnapshot::vue();
    }

    app
      .config()
      .version
      .clone_into(&mut self.version.app);

    let path = Self::path(app)?;
    if let Some(parent) = path.parent() {
      fs::create_dir_all(parent)?;
    }

    error!(name = %self.name, message = %self.message);

    let cache = app.state::<LogCache>();
    let mut cache = cache.0.lock().unwrap();
    cache.push(self);

    if cache.len() > MAX_CACHE_SIZE {
      Log::write_to_disk(app)?;
    }

    Ok(())
  }

  fn datetime_or_default(&self) -> DateTime<FixedOffset> {
    self
      .timestamp
      .as_ref()
      .and_then(|it| DateTime::parse_from_str(it, date::TIMESTAMP).ok())
      .unwrap_or_default()
  }
}

impl PartialOrd for Log {
  fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
    Some(self.cmp(other))
  }
}

impl Ord for Log {
  fn cmp(&self, other: &Self) -> Ordering {
    match self
      .datetime_or_default()
      .cmp(&other.datetime_or_default())
    {
      Ordering::Equal => self.name.cmp(&other.name),
      ordering => ordering,
    }
  }
}
