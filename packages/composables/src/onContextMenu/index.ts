import { toRef, toValue } from 'vue';
import { noop } from '@tb-dev/utils';
import { tryOnScopeDispose, watchImmediate } from '@vueuse/core';
import { handleError, type MaybeNullishRef } from '@manatsu/shared';
import type { ContextMenuEventHandler, OnContextMenuOptions } from './types';

export function onContextMenu(
  target: MaybeNullishRef<Element | Window | Document | typeof globalThis>,
  handler: ContextMenuEventHandler = noop,
  options: OnContextMenuOptions = {}
) {
  const targetRef = toRef(target);
  let removeEventListener: (() => void) | null = null;

  const { enabled = true, prevent = true } = options;

  function callback(e: MouseEvent) {
    if (prevent) {
      e.preventDefault();
    }

    if (toValue(enabled)) {
      execute(e, handler).catch(handleError);
    }
  }

  const stopWatcher = watchImmediate(targetRef, (el) => {
    removeEventListener?.();
    removeEventListener = null;

    el ??= globalThis;
    el.addEventListener('contextmenu', callback);
    removeEventListener = () => el.removeEventListener('contextmenu', callback);
  });

  function stop() {
    stopWatcher();
    removeEventListener?.();
    removeEventListener = null;
  }

  tryOnScopeDispose(() => stop());

  return stop;
}

export function preventContextMenu() {
  return onContextMenu(globalThis, noop, { prevent: true });
}

async function execute(e: MouseEvent, handler: ContextMenuEventHandler) {
  await handler(e);
}
