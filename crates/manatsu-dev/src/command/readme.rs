use crate::package::{self, Package};
use crate::prelude::*;
use colored::Colorize;
use std::env::current_dir;
use std::fs;
use std::time::Instant;

pub fn readme() -> Result<()> {
  let start = Instant::now();

  let filename = "README.md";
  let root_readme = current_dir()?.join(filename);

  println!("{}", "copying README files...".bright_cyan());
  for pkg in Package::public() {
    let pkg = pkg.as_ref();
    let readme = package::dir(pkg)?.join(filename);
    fs::copy(&root_readme, &readme)?;
    println!("copied: {}", readme.display());
  }

  let message = format!("done in {:?}", start.elapsed());
  println!("{}", message.bright_green());

  Ok(())
}
