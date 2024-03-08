mod command;
mod error;
mod prelude;

use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("manatsu")
    .invoke_handler(tauri::generate_handler![
      command::color::hex_to_hsl,
      command::color::hex_to_rgb,
      command::color::hex_to_string,
      command::color::hsl_to_hex,
      command::color::hsl_to_rgb,
      command::color::hsl_to_string,
      command::color::random_hex_color,
      command::color::random_hsl_color,
      command::color::random_rgb_color,
      command::color::random_string_hex_color,
      command::color::random_string_hsl_color,
      command::color::random_string_rgb_color,
      command::color::rgb_to_hex,
      command::color::rgb_to_hsl,
      command::color::rgb_to_string,
      command::color::string_to_hex,
    ])
    .build()
}
