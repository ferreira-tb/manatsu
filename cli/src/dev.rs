mod build;
pub mod component;
mod json;
pub mod package;
mod release;

use anyhow::{Context, Result};
pub use build::build;
use miho;
pub use release::release;
use std::{env, fs};

/// Synchronizes all README files of the monorepo.
pub fn readme() -> Result<()> {
  let filename = "README.md";
  let cwd = env::current_dir()?;
  let src_readme = cwd.join(filename);

  println!("Copying README files...");
  for pkg in package::PACKAGES {
    let dest_readme = package::dir(pkg)?.join(filename);
    fs::copy(&src_readme, &dest_readme)?;
    println!("Copied: {}", dest_readme.display());
  }

  let cli_readme = cwd.join("cli").join(filename);
  fs::copy(&src_readme, &cli_readme)?;
  println!("Copied: {}", cli_readme.display());

  println!("Done!");
  Ok(())
}

pub fn format_files<G>(glob: G) -> Result<()>
where
  G: AsRef<str>,
{
  let glob = glob.as_ref();

  println!("Formatting files...");
  miho::Command::new("pnpm")
    .args(["exec", "prettier", glob, "--write"])
    .stdio(miho::Stdio::Inherit)
    .output()
    .with_context(|| format!("Could not format files: {}", glob))?;

  Ok(())
}

pub fn lint<G>(glob: G, extra_args: Option<Vec<&str>>) -> Result<()>
where
  G: AsRef<str>,
{
  let glob = glob.as_ref();
  let mut cmd = miho::Command::new("pnpm");
  cmd.args(["exec", "eslint", "--fix"]);

  if let Some(args) = extra_args {
    cmd.args(args);
  }

  println!("Linting files...");
  cmd
    .arg(glob)
    .stdio(miho::Stdio::Inherit)
    .output()
    .with_context(|| format!("Could not lint files: {}", glob))?;

  Ok(())
}
