import type { MaybePromise } from '@tb-dev/utils';
import type { MaybeNullishRef } from '@manatsu/shared';

export type ContextMenuEventHandler = (e: MouseEvent) => MaybePromise<void>;

export interface OnContextMenuOptions {
  /** @default true */
  enabled?: MaybeNullishRef<boolean>;
  /** @default true */
  prevent?: boolean;
}
