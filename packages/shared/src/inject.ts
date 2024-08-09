import { getCurrentApp } from './global';
import { type InjectionKey, inject as originalInject } from 'vue';

/** Like `inject`, but throws an error if the value was not provided. */
export function inject<T>(key: InjectionKey<T> | string): T {
  const app = getCurrentApp();
  const value = app.runWithContext(() => originalInject(key));

  if (value === undefined) {
    throw new Error('injection failed: value was not provided');
  }

  return value;
}

/** Like `provide`, but provides the value to the whole app. */
export function provide<T>(key: InjectionKey<T> | string, value: T): void {
  const app = getCurrentApp();
  app.provide(key, value);
}
