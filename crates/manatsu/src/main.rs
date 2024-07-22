mod command;
mod project;

use anyhow::Result;
use clap::Parser;
use command::Command;

#[derive(Debug, Parser)]
#[command(name = "manatsu")]
#[command(version, about, long_about = None)]
enum Cli {
  /// Create a new Tauri project.
  Create(command::Create),
}

#[tokio::main]
async fn main() -> Result<()> {
  let cli = Cli::parse();

  match cli {
    Cli::Create(cmd) => cmd.execute().await,
  }
}
