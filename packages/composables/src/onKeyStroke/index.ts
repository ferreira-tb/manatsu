import { toValue } from 'vue';
import { handleError } from '@manatsu/shared';
import type { KeyStrokeEventHandler, OnKeyStrokeOptions } from './types';
import { type KeyFilter, onKeyStroke as original, tryOnScopeDispose } from '@vueuse/core';

export function onKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options: OnKeyStrokeOptions = {}
) {
  const {
    altKey = false,
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
    enabled = true,
    prevent = true,
  } = options;

  function callback(e: KeyboardEvent) {
    if (
      e.altKey !== altKey ||
      e.ctrlKey !== ctrlKey ||
      e.metaKey !== metaKey ||
      e.shiftKey !== shiftKey
    ) {
      return;
    }

    if (prevent) {
      e.preventDefault();
    }

    if (toValue(enabled)) {
      execute(e, handler).catch(handleError);
    }
  }

  const stop = original(key, callback, options);

  tryOnScopeDispose(() => stop());

  return stop;
}

export async function execute(event: KeyboardEvent, handler?: KeyStrokeEventHandler) {
  await handler?.(event);
}

export function onKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options: Omit<OnKeyStrokeOptions, 'eventName'> = {}
) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keydown' });
}

export function onAltKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'altKey'>
) {
  return onKeyDown(key, handler, { ...options, altKey: true });
}

export function onCtrlKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'ctrlKey'>
) {
  return onKeyDown(key, handler, { ...options, ctrlKey: true });
}

export function onShiftKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'shiftKey'>
) {
  return onKeyDown(key, handler, { ...options, shiftKey: true });
}

export function onCtrlShiftKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'ctrlKey' | 'shiftKey'>
) {
  return onKeyDown(key, handler, { ...options, ctrlKey: true, shiftKey: true });
}
