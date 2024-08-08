const COMMANDS: &[&str] = &[
  "save_log",
  "set_default_vue_version",
  "version_snapshot",
];

fn main() {
  tauri_plugin::Builder::new(COMMANDS).build();
}
