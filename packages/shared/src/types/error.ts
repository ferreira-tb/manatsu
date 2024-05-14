import type { Nullish } from '@tb-dev/utility-types';

export interface VersionSnapshot {
  readonly app?: Nullish<string>;
  readonly manatsu?: Nullish<string>;
  readonly os?: Nullish<string>;
  readonly tauri?: Nullish<string>;
  readonly vue?: Nullish<string>;
  readonly webview?: Nullish<string>;
}

export interface Log {
  readonly message: string;
  readonly name: string;
  readonly stack?: Nullish<string>;
  readonly timestamp?: Nullish<string>;
  readonly version: VersionSnapshot;
}
