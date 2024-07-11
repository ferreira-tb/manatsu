import type { Nullish } from '@tb-dev/utils';
import { handleError } from '@manatsu/shared';
import { type MaybeRefOrGetter, toRef } from 'vue';
import { tryOnScopeDispose, watchImmediate } from '@vueuse/core';
import { type EventCallback, type EventName, type Options, listen } from '@tauri-apps/api/event';

export function useListen<T = unknown>(
  event: MaybeRefOrGetter<EventName>,
  handler: EventCallback<T>,
  options?: Options
) {
  const eventRef = toRef(event);
  let unlisten: Nullish<Awaited<ReturnType<typeof listen>>> = null;

  const stopWatcher = watchImmediate(eventRef, async (e) => {
    let fn: typeof unlisten;
    try {
      fn = await listen(e, handler, options);
      unlisten?.();
      unlisten = fn;
    } catch (err) {
      fn?.();
      handleError(err);
    }
  });

  function stop() {
    stopWatcher();
    unlisten?.();
  }

  tryOnScopeDispose(() => stop());

  return stop;
}
