const COMMANDS: &[&str] = &[
  "is_dev",
  "save_log",
  "set_default_vue_version",
  "version",
  "version_snapshot",
];

fn main() {
  tauri_plugin::Builder::new(COMMANDS).build();
}
