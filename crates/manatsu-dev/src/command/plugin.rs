use crate::package;
use crate::prelude::*;
use crate::utils::Formatter;
use colored::Colorize;
use convert_case::{Case, Casing};
use regex::Regex;
use std::env::current_dir;
use std::fs;
use std::time::Instant;

/// <https://regex101.com/r/e0611R>
const ENUM_REGEX: &str = r"enum\s*Command\s*\{(?:\s*[A-Za-z]+\s*=\s*'[A-Za-z_:|]+',?\s*)*\}";
const COMMAND_PREFIX: &str = "plugin:manatsu|";

pub async fn plugin() -> Result<()> {
  let start = Instant::now();

  println!("{}", "updating plugin commands...".bright_cyan());
  let index = package::index("tauri-plugin")?;
  let contents = fs::read_to_string(&index)?;

  let mut commands = get_commands()?
    .into_iter()
    .map(to_enum_variant)
    .collect_vec();

  commands.sort_unstable();

  let regex = Regex::new(ENUM_REGEX)?;
  let command_enum = format!("enum Command {{ {} }}", commands.join(","));
  let contents = regex.replace(&contents, command_enum);

  fs::write(index, contents.into_owned())?;

  let glob = "**/tauri-plugin/src/index.ts";
  Formatter::new(glob).format().await?;

  let message = format!("done in {:?}", start.elapsed());
  println!("{}", message.bright_green());

  Ok(())
}

fn get_commands() -> Result<Vec<String>> {
  let path = "crates/tauri-plugin-manatsu/permissions/autogenerated/commands";
  let dir = current_dir()?.join(path);

  let commands = fs::read_dir(dir)?
    .filter_map(|entry| {
      entry
        .ok()?
        .path()
        .file_stem()
        .map(|stem| stem.to_string_lossy().into_owned())
    })
    .collect_vec();

  Ok(commands)
}

#[allow(clippy::needless_pass_by_value)]
fn to_enum_variant(command: String) -> String {
  let pascal = command.to_case(Case::Pascal);
  format!("{pascal} = '{COMMAND_PREFIX}{command}'")
}
