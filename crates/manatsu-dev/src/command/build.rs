use crate::package::{self, Package};
use crate::prelude::*;
use clap::Args;

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
      .unwrap_or_else(|| {
        Package::PUBLIC
          .iter()
          .map(ToString::to_string)
          .collect()
      })
      .into_iter()
      .map(|pkg| {
        pkg
          .trim()
          .replace("@manatsu/", "")
          .to_case(Case::Kebab)
      })
      .collect_vec();

    if packages.is_empty() {
      bail!("{}", "nothing to build".red());
    }

    if packages.len() == 1 && packages[0] == "shared" {
      return Ok(());
    }

    for package in &packages {
      let package = package.as_str();

      if should_build(package) {
        args.push("-F");
        args.push(package);
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

fn should_build(package: &str) -> bool {
  // The shared package should already been built at this point.
  package != "shared"
}

fn copy_files(packages: &Vec<String>) -> Result<()> {
  let dist = package::dist("manatsu")?;
  for pkg in packages {
    if Package::is_manual_chunk(pkg) {
      let to = dist.join(format!("{pkg}.d.ts"));
      fs::copy(package::dts(pkg)?, to)?;
    }
  }

  Ok(())
}
