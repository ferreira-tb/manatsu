import { type MaybeRefOrGetter, type Ref, toRef } from 'vue';
import { type MaybeElement, useElementSize as original } from '@vueuse/core';

/** Shorthand for `useElementSize` with `border-box` as the default box model. */
export function useElementSize<T extends MaybeElement>(element: MaybeRefOrGetter<T>) {
  return original(toRef(element), { height: 0, width: 0 }, { box: 'border-box' });
}

export function useHeight<T extends MaybeElement>(element: MaybeRefOrGetter<T>) {
  return useElementSize(element).height as Readonly<Ref<number>>;
}

export function useWidth<T extends MaybeElement>(element: MaybeRefOrGetter<T>) {
  return useElementSize(element).width as Readonly<Ref<number>>;
}
