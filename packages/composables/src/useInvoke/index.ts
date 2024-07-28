import { invoke } from '@tauri-apps/api/core';
import { getCurrentApp, handleError } from '@manatsu/shared';
import type { UseInvokeOptions, UseInvokeReturn } from './types';
import { tryOnScopeDispose, watchTriggerable } from '@vueuse/core';
import { type MaybeRefOrGetter, readonly, type Ref, ref, shallowRef, toRef, toValue } from 'vue';

export type { UseInvokeOptions, UseInvokeReturn } from './types';

export function useInvoke<Data>(
  command: MaybeRefOrGetter<string>,
  initial: Data,
  options: UseInvokeOptions<Data> = {}
): UseInvokeReturn<Data> {
  const { deep = false, lazy = false, shallow = true } = options;

  let id: symbol | null = null;
  const commandRef = toRef(command);
  const argsRef = toRef(options.args);

  const loading = ref(false);
  const state = shallow ? shallowRef(initial) : ref(initial);

  const { stop: stopWatcher, trigger } = watchTriggerable(
    [commandRef, argsRef],
    async () => {
      const current = Symbol('useInvoke');
      id = current;

      try {
        loading.value = true;
        let result = await invoke<Data>(toValue(command), toValue(argsRef) ?? undefined);
        if (options.transform) result = await options.transform(result);

        if (current === id) {
          state.value = result;
          await options.onSucess?.call(getCurrentApp(), result);
        }
      } catch (err) {
        if (options.onError) {
          options.onError.call(getCurrentApp(), err);
        } else {
          handleError(err);
        }
      } finally {
        if (current === id) {
          loading.value = false;
        }
      }
    },
    {
      deep,
      immediate: !lazy,
    }
  );

  function stop() {
    stopWatcher();
    id = null;
  }

  tryOnScopeDispose(() => stop());

  return {
    state: state as Ref<Data>,
    loading: readonly(loading),
    execute: trigger,
    stop,
  };
}
