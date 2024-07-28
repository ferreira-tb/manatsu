use crate::prelude::*;
use colored::Colorize;
use serde::Deserialize;
use std::env::current_dir;
use std::fs;

#[derive(Deserialize)]
pub struct Config {
  pub github: bool,
  pub github_token: String,
}

impl Config {
  /// Read the local configuration file.
  pub fn read() -> Result<Config> {
    let path = current_dir()?.join("config.json");
    let config = fs::read_to_string(path)?;
    serde_json::from_str::<Config>(&config).map_err(Into::into)
  }
}

pub struct Formatter<'a> {
  glob: &'a str,
}

impl<'a> Formatter<'a> {
  pub fn new(glob: &'a str) -> Self {
    Self { glob }
  }

  /// Format files using Prettier.
  pub async fn format(&self) -> Result<()> {
    let mut args = vec!["exec", "prettier", "--write"];
    args.push(self.glob);

    println!("{}", "formatting files...".bright_cyan());
    let status = pnpm!(args).spawn()?.wait().await?;
    bail_on_status_err!(status, "{}", "failed to format files".red());

    Ok(())
  }
}

impl Default for Formatter<'_> {
  fn default() -> Self {
    Self::new(".")
  }
}
