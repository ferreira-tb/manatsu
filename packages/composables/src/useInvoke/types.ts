import type { App, Ref } from 'vue';
import type { InvokeArgs } from '@tauri-apps/api/core';
import type { MaybePromise, Nullish } from '@tb-dev/utils';
import type { ErrorHandler, MaybeNullishRef } from '@manatsu/shared';

export interface UseInvokeOptions<Data> {
  /** Arguments to pass to the command. */
  readonly args?: MaybeNullishRef<InvokeArgs>;
  /**
   * Whether to deep watch for changes.
   * @default false
   */
  readonly deep?: boolean;

  /**
   * Whether to execute the command immediately.
   * @default false
   */
  readonly lazy?: boolean;

  /**
   * Whether to use a shallow ref for the state.
   * @default true
   */
  readonly shallow?: boolean;

  readonly onError?: Nullish<ErrorHandler>;
  readonly onSucess?: Nullish<(this: App, value: Data) => MaybePromise<void>>;
  readonly transform?: (value: Data) => MaybePromise<Data>;
}

export interface UseInvokeReturn<Data> {
  readonly execute: () => Promise<void>;
  readonly loading: Readonly<Ref<boolean>>;
  readonly state: Ref<Data>;
  readonly stop: () => void;
}
