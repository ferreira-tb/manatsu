use crate::package::{self, Package};
use crate::prelude::*;
use clap::Args;
use colored::Colorize;
use std::fs;
use std::time::Instant;

#[derive(Debug, Args)]
pub struct Build {
  #[arg(short = 'p', long, value_name = "PACKAGE")]
  package: Option<Vec<String>>,
}

impl super::Command for Build {
  async fn execute(self) -> Result<()> {
    let start = Instant::now();

    // The shared package must be built before the others.
    build_shared().await?;

    let mut args = vec!["run", "--parallel", "--bail"];

    let packages = self
      .package
      .map_or_else(Package::public, Package::from_iter)
      .into_iter()
      .collect_vec();

    if packages.is_empty() {
      bail!("{}", "nothing to build".red());
    }

    if packages.len() == 1 && packages[0].is_shared() {
      return Ok(());
    }

    for package in &packages {
      if should_build(package) {
        args.push("-F");
        args.push(package.as_ref());
      }
    }

    if !args.contains(&"-F") {
      bail!("{}", "selected package(s) cannot be built".red());
    }

    args.push("build");

    println!("{}", "building packages...".bright_cyan());
    let status = pnpm!(args).spawn()?.wait().await?;
    bail_on_status_err!(status, "{}", "failed to build packages".red());

    println!("{}", "copying built files...".bright_cyan());
    copy_files(&packages)?;

    println!("built in {:?}", start.elapsed());

    Ok(())
  }
}

async fn build_shared() -> Result<()> {
  println!("{}", "building shared package...".bright_cyan());
  let status = pnpm!(["run", "-F", "shared", "build"])
    .spawn()?
    .wait()
    .await?;

  bail_on_status_err!(status, "{}", "failed to build shared package".red());

  Ok(())
}

fn should_build(package: &Package) -> bool {
  // The shared package should already been built at this point.
  !package.is_shared()
}

fn copy_files(packages: &[Package]) -> Result<()> {
  let dist = package::dist(Package::Manatsu.as_ref())?;
  for pkg in packages {
    if pkg.is_manual_chunk() {
      let pkg = pkg.as_ref();
      let to = dist.join(format!("{pkg}.d.ts"));
      fs::copy(package::dts(pkg)?, to)?;
    }
  }

  Ok(())
}
