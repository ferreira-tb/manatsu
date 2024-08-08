export { createVersionSnapshot, log } from '@manatsu/tauri-plugin/src/index.ts';

export {
  createManatsu,
  defaultErrorHandler,
  type ManatsuOptions,
} from '@manatsu/vue-plugin/src/index.ts';

export {
  computedAsync,
  onAltKeyDown,
  onCtrlKeyDown,
  onCtrlShiftKeyDown,
  onKeyDown,
  onKeyStroke,
  onShiftKeyDown,
  useElementSize,
  useHeight,
  useWidth,
  useWindowHeight,
  useWindowWidth,
} from '@manatsu/composables/src/index.ts';

export {
  type ComputedSymbol,
  type ErrorLog,
  getCurrentApp,
  handleError,
  inject,
  type MaybeNullishRef,
  provide,
  type RefSymbol,
  type ShallowRefSymbol,
  type VersionSnapshot,
  type WritableRefSymbol,
  type WritableShallowRefSymbol,
} from '@manatsu/shared';

declare global {
  interface Window {
    readonly MANATSU: {
      dev: boolean;
    };
  }
}
