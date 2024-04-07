#![allow(clippy::must_use_candidate)]

mod command;
pub(crate) mod prelude;
pub(crate) mod project;

use clap::Parser;
use command::Command;
use prelude::*;

#[derive(Debug, Parser)]
#[command(name = "manatsu")]
#[command(version, about, long_about = None)]
enum Cli {
  /// Easily create a new project.
  Create(command::Create),
}

#[tokio::main]
async fn main() -> Result<()> {
  let cli = Cli::parse();

  match cli {
    Cli::Create(cmd) => cmd.execute().await,
  }
}
