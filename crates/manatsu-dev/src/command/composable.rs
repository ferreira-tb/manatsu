use crate::package;
use crate::util::{Formatter, Linter};
use anyhow::{bail, Result};
use convert_case::{Case, Casing};
use regex::Regex;
use std::fs;
use std::path::Path;
use std::time::Instant;

/// <https://regex101.com/r/vBQTOL>
const NAME_REGEX: &str = r"^use(?:-?[a-zA-Z])*$";

pub async fn create<T: AsRef<str>>(name: T) -> Result<()> {
  let start = Instant::now();

  let name = name.as_ref();
  if !is_valid(name) {
    bail!("invalid composable name: {}", name);
  }

  let camel = name.to_case(Case::Camel);
  let dir = package::src("composables")?.join(&camel);

  if dir.try_exists()? {
    bail!("composable {camel} already exists");
  }

  fs::create_dir_all(&dir)?;

  write_index(&camel, &dir)?;
  write_test(&camel, &dir)?;

  // Formats the files to ensure their structure is correct.
  let glob = format!("**/composables/src/{camel}/**/*.ts");
  Formatter::new(&glob).format().await?;

  // Adds an export declaration to the src index.
  write_to_src_index(&camel)?;

  // Lint the files to ensure that the exports are sorted.
  Linter::new(&glob)
    .arg("**/composables/src/index.ts")
    .lint()
    .await?;

  println!("composable {camel} created in {:?}", start.elapsed());
  Ok(())
}

fn write_index(camel: &str, dir: &Path) -> Result<()> {
  let mut cts = String::from("import { type MaybeRefOrGetter, toRef } from 'vue';\n\n");
  cts.push_str(format!("export function {camel}() {{ /* TODO */ }}").as_str());

  let path = dir.join("index.ts");
  fs::write(path, cts).map_err(Into::into)
}

fn write_test(camel: &str, dir: &Path) -> Result<()> {
  let mut cts = String::from("import { describe, it } from 'vitest';\n");
  cts.push_str(format!("// import {{ {camel} }} from '.';\n\n").as_str());
  cts.push_str(format!("describe('{camel}', () => {{ it.todo('todo'); }});").as_str());

  let path = dir.join("index.test.ts");
  fs::write(path, cts).map_err(Into::into)
}

fn write_to_src_index(camel: &str) -> Result<()> {
  let src = package::src("composables")?;
  let path = src.join("index.ts");

  let mut cts = fs::read_to_string(&path)?;
  let export_decl = format!("export * from './{camel}';\n");
  cts.push_str(export_decl.as_str());

  fs::write(path, cts).map_err(Into::into)
}

/// Determines whether the composable name is valid.
pub fn is_valid<T: AsRef<str>>(name: T) -> bool {
  let regex = Regex::new(NAME_REGEX).expect("hardcoded regex should be valid");
  regex.is_match(name.as_ref())
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn should_determine_if_name_is_valid() {
    assert!(is_valid("useManatsu"));
    assert!(!is_valid("composable-name"));
  }
}
