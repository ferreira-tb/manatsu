import type { App } from 'vue';
import { type Nullish, panic } from '@tb-dev/utils';

export type ErrorHandler = (this: App, err: unknown) => void;

export interface ManatsuGlobal {
  readonly app: App;
  errorHandler?: Nullish<ErrorHandler>;
}

function createScope() {
  let globalManatsu: ManatsuGlobal | null = null;

  function get(): ManatsuGlobal {
    return globalManatsu ?? panic('manatsu plugin must be installed');
  }

  function set(manatsu: ManatsuGlobal) {
    globalManatsu = manatsu;
  }

  return { get, set };
}

const { get, set } = createScope();

export { get as getGlobalManatsu, set as setGlobalManatsu };

/**
 * Get the current app instance.
 * This should be called only after the manatsu plugin has been installed.
 */
export function getCurrentApp(): App {
  return get().app;
}
