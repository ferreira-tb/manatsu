import { toRef, toValue } from 'vue';
import { noop, type Nullish } from '@tb-dev/utils';
import { tryOnScopeDispose, watchImmediate } from '@vueuse/core';
import { handleError, type MaybeNullishRef } from '@manatsu/shared';
import type { ContextMenuEventHandler, OnContextMenuOptions } from './types';

export function onContextMenu(
  target: MaybeNullishRef<Element | Window | Document | typeof globalThis>,
  handler: ContextMenuEventHandler = noop,
  options: OnContextMenuOptions = {}
) {
  const { enabled = true, prevent = true } = options;
  let removeListener: Nullish<() => void>;

  function callback(e: MouseEvent) {
    if (prevent) {
      e.preventDefault();
    }

    if (toValue(enabled)) {
      execute(e, handler).catch(handleError);
    }
  }

  const stopWatcher = watchImmediate(toRef(target), (el) => {
    removeListener?.();
    removeListener = null;

    if (el) {
      el.addEventListener('contextmenu', callback);
      removeListener = () => el.removeEventListener('contextmenu', callback);
    }
  });

  function stop() {
    stopWatcher();
    removeListener?.();
    removeListener = null;
  }

  tryOnScopeDispose(() => stop());

  return stop;
}

async function execute(e: MouseEvent, handler: ContextMenuEventHandler) {
  await handler(e);
}
