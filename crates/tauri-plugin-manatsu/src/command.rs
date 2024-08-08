use crate::error::Result;
use crate::log::{Log, VersionSnapshot, VUE_VERSION};
use tauri::{AppHandle, Runtime};

#[tauri::command]
pub async fn save_log<R: Runtime>(app: AppHandle<R>, log: Log) -> Result<()> {
  log.save(&app).map_err(Into::into)
}

#[tauri::command]
pub async fn set_default_vue_version(version: String) {
  let _ = VUE_VERSION.set(version);
}

#[tauri::command]
pub async fn version_snapshot(vue: Option<String>) -> VersionSnapshot {
  VersionSnapshot { vue, ..Default::default() }
}
