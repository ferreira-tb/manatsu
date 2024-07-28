import { version as VUE_VERSION } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import type { ErrorLog, VersionSnapshot } from '@manatsu/shared';

const enum Command {
  IsDev = 'plugin:manatsu|is_dev',
  SaveLog = 'plugin:manatsu|save_log',
  SetDefaultVueVersion = 'plugin:manatsu|set_default_vue_version',
  Version = 'plugin:manatsu|version',
  VersionSnapshot = 'plugin:manatsu|version_snapshot',
}

export function createVersionSnapshot(): Promise<VersionSnapshot> {
  return invoke(Command.VersionSnapshot, { vue: VUE_VERSION });
}

export function isDev(): Promise<boolean> {
  return invoke(Command.IsDev);
}

export function log(err: ErrorLog): Promise<void> {
  return invoke(Command.SaveLog, { log: err });
}

export function version(): Promise<string> {
  return invoke(Command.Version);
}

/** @internal */
export function setDefaultVueVersion(): Promise<void> {
  return invoke(Command.SetDefaultVueVersion, { version: VUE_VERSION });
}
