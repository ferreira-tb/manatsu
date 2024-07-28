#[macro_export]
macro_rules! command {
  ($program:expr) => {{
    #[cfg(target_os = "windows")]
    {
      let mut cmd = tokio::process::Command::new("cmd");
      cmd.args(&["/C", $program]);
      cmd
    }

    #[cfg(not(target_os = "windows"))]
    tokio::process::Command::new($program)
  }};
}

#[macro_export]
macro_rules! cargo {
  ($args:expr) => {{
    tokio::process::Command::new("cargo").args($args)
  }};
  ($( $arg:literal ),*) => {{
    let mut args: Vec<&str> = Vec::new();
    $( args.push($arg); )*

    $crate::cargo!(args)
  }};
}

#[macro_export]
macro_rules! pnpm {
  ($args:expr) => {{
    $crate::command!("pnpm").args($args)
  }};
  ($( $arg:literal ),*) => {{
    let mut args: Vec<&str> = Vec::new();
    $( args.push($arg); )*

    $crate::pnpm!(args)
  }};
}

#[macro_export]
macro_rules! bail_on_output_err {
  ($output:expr) => {
    if !$output.status.success() {
      let stderr = String::from_utf8_lossy(&$output.stderr).into_owned();
      anyhow::bail!("{}", stderr);
    }
  };
}

#[macro_export]
macro_rules! bail_on_status_err {
  ($status:expr, $($message:tt)*) => {
    if !$status.success() {
      anyhow::bail!($($message)*);
    }
  };
}
