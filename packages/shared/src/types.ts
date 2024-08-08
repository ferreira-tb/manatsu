import type { Nullish } from '@tb-dev/utils';
import type { ComputedRef, InjectionKey, MaybeRefOrGetter, Ref, ShallowRef } from 'vue';

export type MaybeNullishRef<T> = MaybeRefOrGetter<Nullish<T>>;

export type ComputedSymbol<T> = InjectionKey<ComputedRef<T>>;
export type RefSymbol<T> = InjectionKey<Readonly<Ref<T>>>;
export type ShallowRefSymbol<T> = InjectionKey<Readonly<ShallowRef<T>>>;
export type WritableRefSymbol<T> = InjectionKey<Ref<T>>;
export type WritableShallowRefSymbol<T> = InjectionKey<ShallowRef<T>>;
