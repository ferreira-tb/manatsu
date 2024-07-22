export {
  createManatsu,
  defaultErrorHandler,
  type ManatsuOptions
} from '@manatsu/vue-plugin/src/index.ts';

export {
  createVersionSnapshot,
  getManatsuVersion,
  isDev,
  saveLog
} from '@manatsu/tauri-plugin/src/index.ts';

export {
  type ComputedSymbol,
  EmptyComponent,
  getCurrentApp,
  handleError,
  injectStrict,
  type Log,
  type MaybeNullishRef,
  type RefSymbol,
  type ShallowRefSymbol,
  type VersionSnapshot,
  type WritableRefSymbol,
  type WritableShallowRefSymbol
} from '@manatsu/shared';

export {
  computedAsync,
  invokeOnKeyDown,
  invokeOnKeyStroke,
  onAltKeyDown,
  onAltKeyStroke,
  onContextMenu,
  onCtrlKeyDown,
  onCtrlKeyStroke,
  onCtrlShiftKeyDown,
  onCtrlShiftKeyStroke,
  onKeyDown,
  onKeyStroke,
  onShiftKeyDown,
  onShiftKeyStroke,
  preventContextMenu,
  preventCtrlKeyDown,
  preventCtrlKeyStroke,
  preventCtrlShiftKeyDown,
  preventCtrlShiftKeyStroke,
  preventKeyDown,
  preventKeyStroke,
  preventShiftKeyDown,
  preventShiftKeyStroke,
  useElementSize,
  useHeight,
  useInvoke,
  type UseInvokeOptions,
  type UseInvokeReturn,
  useListen,
  useWidth,
  useWindowHeight,
  useWindowWidth
} from '@manatsu/composables/src/index.ts';

declare global {
  interface Window {
    readonly MANATSU: {
      dev: boolean;
    };
  }
}
