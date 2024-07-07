import type { Nullish } from '@tb-dev/utility-types';
import type { KeyStrokeEventHandler } from './types';
import { type InvokeArgs, invoke as tauriInvoke } from '@tauri-apps/api/core';

export async function execute(event: KeyboardEvent, handler?: KeyStrokeEventHandler) {
  await handler?.(event);
}

export function invoke(command: string, args?: Nullish<InvokeArgs>) {
  return async function () {
    await tauriInvoke(command, args ?? undefined);
  };
}
