import type { MaybeRefOrGetter } from 'vue';
import type { Nullish } from '@tb-dev/utils';

export type MaybeNullishRef<T> = MaybeRefOrGetter<Nullish<T>>;
