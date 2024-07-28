import { version as VUE_VERSION } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import type { Log, VersionSnapshot } from '@manatsu/shared';

const enum Command {
  IsDev = 'plugin:manatsu|is_dev',
  ManatsuVersion = 'plugin:manatsu|manatsu_version',
  SaveLog = 'plugin:manatsu|save_log',
  SetDefaultVueVersion = 'plugin:manatsu|set_default_vue_version',
  VersionSnapshot = 'plugin:manatsu|version_snapshot',
}

export function createVersionSnapshot(): Promise<VersionSnapshot> {
  return invoke(Command.VersionSnapshot, { vue: VUE_VERSION });
}

export function isDev(): Promise<boolean> {
  return invoke(Command.IsDev);
}

export function getManatsuVersion(): Promise<string> {
  return invoke(Command.ManatsuVersion);
}

export function saveLog(log: Log): Promise<void> {
  return invoke(Command.SaveLog, { log });
}

/** @internal */
export function setDefaultVueVersion(): Promise<void> {
  return invoke(Command.SetDefaultVueVersion, { version: VUE_VERSION });
}
