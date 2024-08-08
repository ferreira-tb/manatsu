import type { App, Plugin } from 'vue';
import { log, setDefaultVueVersion } from '@manatsu/tauri-plugin/src/index.ts';
import { type ErrorHandler, handleError, setGlobalManatsu } from '@manatsu/shared';

export interface ManatsuOptions {
  errorHandler?: ErrorHandler;
}

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      const errorHandler = (options.errorHandler ?? defaultErrorHandler).bind(app);
      setGlobalManatsu({ app, errorHandler });

      setDefaultVueVersion().catch(handleError);

      app.config.errorHandler = (err) => handleError(err);
    },
  };

  return manatsu;
}

export function defaultErrorHandler(this: App, err: unknown) {
  void log({
    message: err instanceof Error ? err.message : String(err),
    name: err instanceof Error ? err.name : 'Error',
    stack: err instanceof Error ? err.stack : null,
    version: { vue: this.version },
  });
}
