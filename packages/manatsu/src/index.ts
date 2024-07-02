export {
  type ManatsuOptions,
  createManatsu,
  defaultErrorHandler
} from '@manatsu/vue-plugin/src/index.ts';

export {
  Command,
  createVersionSnapshot,
  getManatsuVersion,
  isDev,
  saveLog
} from '@manatsu/tauri-plugin/src/index.ts';

export {
  type ComputedSymbol,
  EmptyComponent,
  type Log,
  type MaybeNullishRef,
  type RefSymbol,
  type ShallowRefSymbol,
  type VersionSnapshot,
  type WritableRefSymbol,
  type WritableShallowRefSymbol,
  getCurrentApp,
  handleError,
  injectStrict
} from '@manatsu/shared';

export {
  type UseInvokeOptions,
  type UseInvokeReturn,
  invokeOnKeyDown,
  invokeOnKeyStroke,
  navigateOnKeyDown,
  navigateOnKeyStroke,
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
