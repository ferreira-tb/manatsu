import type { Nullish } from '@tb-dev/utils';
import { handleError } from '@manatsu/shared';
import { type MaybeRefOrGetter, toRef } from 'vue';
import { tryOnScopeDispose, watchImmediate } from '@vueuse/core';
import { type EventCallback, type EventName, listen, type Options } from '@tauri-apps/api/event';

export function useListen<T = unknown>(
  event: MaybeRefOrGetter<EventName>,
  handler: EventCallback<T>,
  options?: Options
) {
  let unlisten: Nullish<Awaited<ReturnType<typeof listen>>>;

  const stopWatcher = watchImmediate(toRef(event), async (e) => {
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
