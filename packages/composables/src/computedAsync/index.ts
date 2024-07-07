import type { Ref } from 'vue';
import { handleError } from '@manatsu/shared';
import {
  type AsyncComputedOnCancel,
  type AsyncComputedOptions,
  computedAsync as original
} from '@vueuse/core';

export function computedAsync<T>(
  initial: T,
  callback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  options?: Ref<boolean> | AsyncComputedOptions
) {
  return original(callback, initial, { onError: handleError, ...options }) as Readonly<Ref<T>>;
}
