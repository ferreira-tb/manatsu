use crate::prelude::*;
use convert_case::{Case, Casing};
use serde::Deserialize;
use std::env::current_dir;
use std::fs;
use std::path::PathBuf;
use strum::{AsRefStr, Display, EnumIs, EnumIter, EnumString, IntoEnumIterator};

#[derive(AsRefStr, Debug, PartialEq, Eq, Display, EnumIs, EnumString, EnumIter)]
#[strum(serialize_all = "kebab-case")]
pub enum Package {
  Manatsu,
  Composables,
  Shared,
  TauriPlugin,
  VuePlugin,
}

impl Package {
  pub const MANUAL_CHUNK: [Package; 3] = [
    Package::Composables,
    Package::TauriPlugin,
    Package::VuePlugin,
  ];

  pub fn public() -> Vec<Self> {
    Self::iter().collect()
  }

  pub fn from_iter<I>(iter: I) -> Vec<Self>
  where
    I: IntoIterator<Item = String>,
  {
    iter
      .into_iter()
      .map(|it| {
        it.trim()
          .replace("@manatsu/", "")
          .to_case(Case::Kebab)
      })
      .filter_map(|it| Package::try_from(it.as_str()).ok())
      .collect()
  }

  pub fn is_manual_chunk(&self) -> bool {
    Self::MANUAL_CHUNK.contains(self)
  }
}

#[derive(Deserialize)]
#[serde(rename_all(serialize = "snake_case", deserialize = "camelCase"))]
pub struct PackageManifest {
  pub version: String,
}

impl PackageManifest {
  pub fn read_root() -> Result<PackageManifest> {
    let path: PathBuf = current_dir()?.join("package.json");
    let package = fs::read_to_string(path)?;
    serde_json::from_str::<PackageManifest>(&package).map_err(Into::into)
  }
}

pub fn dir(package: &str) -> Result<PathBuf> {
  let path = current_dir()?.join(format!("packages/{package}"));
  Ok(path)
}

macro_rules! create_fn {
  ($name:ident, $call:ident, $path:literal) => {
    pub fn $name(package: &str) -> Result<PathBuf> {
      let path = $call(package)?.join($path);
      Ok(path)
    }
  };
}

create_fn!(src, dir, "src");
create_fn!(dist, dir, "dist");
create_fn!(dts, dist, "index.d.ts");
create_fn!(index, src, "index.ts");
