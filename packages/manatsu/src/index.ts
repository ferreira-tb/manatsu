export { createVersionSnapshot, isDev, log, version } from '@manatsu/tauri-plugin/src/index.ts';

export {
  createManatsu,
  defaultErrorHandler,
  type ManatsuOptions,
} from '@manatsu/vue-plugin/src/index.ts';

export {
  type ComputedSymbol,
  EmptyComponent,
  type ErrorLog,
  getCurrentApp,
  handleError,
  injectStrict,
  type MaybeNullishRef,
  type RefSymbol,
  type ShallowRefSymbol,
  type VersionSnapshot,
  type WritableRefSymbol,
  type WritableShallowRefSymbol,
} from '@manatsu/shared';

export {
  computedAsync,
  onAltKeyDown,
  onContextMenu,
  onCtrlKeyDown,
  onCtrlShiftKeyDown,
  onKeyDown,
  onKeyStroke,
  onShiftKeyDown,
  useElementSize,
  useHeight,
  useInvoke,
  type UseInvokeOptions,
  type UseInvokeReturn,
  useListen,
  useWidth,
  useWindowHeight,
  useWindowWidth,
} from '@manatsu/composables/src/index.ts';

declare global {
  interface Window {
    readonly MANATSU: {
      dev: boolean;
    };
  }
}
