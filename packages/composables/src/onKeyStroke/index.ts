import { toValue } from 'vue';
import { execute, invoke } from './utils';
import { handleError } from '@manatsu/shared';
import { type Nullish, noop } from '@tb-dev/utils';
import type { InvokeArgs } from '@tauri-apps/api/core';
import { type KeyFilter, onKeyStroke as original, tryOnScopeDispose } from '@vueuse/core';
import type { KeyStrokeEventHandler, OnKeyStrokeOptions, PreventKeyStrokeOptions } from './types';

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
    prevent = true
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

export function onKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options: Omit<OnKeyStrokeOptions, 'eventName'> = {}
) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keydown' });
}

export function onAltKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'altKey'>
) {
  return onKeyStroke(key, handler, { ...options, altKey: true });
}

export function onAltKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'altKey'>
) {
  return onKeyDown(key, handler, { ...options, altKey: true });
}

export function onCtrlKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'ctrlKey'>
) {
  return onKeyStroke(key, handler, { ...options, ctrlKey: true });
}

export function onCtrlKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'ctrlKey'>
) {
  return onKeyDown(key, handler, { ...options, ctrlKey: true });
}

export function onShiftKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'shiftKey'>
) {
  return onKeyStroke(key, handler, { ...options, shiftKey: true });
}

export function onShiftKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'shiftKey'>
) {
  return onKeyDown(key, handler, { ...options, shiftKey: true });
}

export function onCtrlShiftKeyStroke(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'ctrlKey' | 'shiftKey'>
) {
  return onKeyStroke(key, handler, { ...options, ctrlKey: true, shiftKey: true });
}

export function onCtrlShiftKeyDown(
  key: KeyFilter,
  handler?: KeyStrokeEventHandler,
  options?: Omit<OnKeyStrokeOptions, 'eventName' | 'ctrlKey' | 'shiftKey'>
) {
  return onKeyDown(key, handler, { ...options, ctrlKey: true, shiftKey: true });
}

export function invokeOnKeyStroke(
  key: KeyFilter,
  command: string,
  args?: Nullish<InvokeArgs>,
  options?: OnKeyStrokeOptions
) {
  return onKeyStroke(key, invoke(command, args), options);
}

export function invokeOnKeyDown(
  key: KeyFilter,
  command: string,
  args?: Nullish<InvokeArgs>,
  options?: Omit<OnKeyStrokeOptions, 'eventName'>
) {
  return onKeyDown(key, invoke(command, args), options);
}

export function preventKeyStroke(key: KeyFilter, options?: PreventKeyStrokeOptions) {
  return onKeyStroke(key, noop, { ...options, prevent: true });
}

export function preventKeyDown(
  key: KeyFilter,
  options?: Omit<PreventKeyStrokeOptions, 'eventName'>
) {
  return onKeyDown(key, noop, { ...options, prevent: true });
}

export function preventCtrlKeyStroke(
  key: KeyFilter,
  options?: Omit<PreventKeyStrokeOptions, 'ctrlKey'>
) {
  return preventKeyStroke(key, { ...options, ctrlKey: true });
}

export function preventCtrlKeyDown(
  key: KeyFilter,
  options?: Omit<PreventKeyStrokeOptions, 'eventName' | 'ctrlKey'>
) {
  return preventKeyDown(key, { ...options, ctrlKey: true });
}

export function preventShiftKeyStroke(
  key: KeyFilter,
  options?: Omit<PreventKeyStrokeOptions, 'shiftKey'>
) {
  return preventKeyStroke(key, { ...options, shiftKey: true });
}

export function preventShiftKeyDown(
  key: KeyFilter,
  options?: Omit<PreventKeyStrokeOptions, 'eventName' | 'shiftKey'>
) {
  return preventKeyDown(key, { ...options, shiftKey: true });
}

export function preventCtrlShiftKeyStroke(
  key: KeyFilter,
  options?: Omit<PreventKeyStrokeOptions, 'ctrlKey' | 'shiftKey'>
) {
  return preventKeyStroke(key, { ...options, ctrlKey: true, shiftKey: true });
}

export function preventCtrlShiftKeyDown(
  key: KeyFilter,
  options?: Omit<PreventKeyStrokeOptions, 'eventName' | 'ctrlKey' | 'shiftKey'>
) {
  return preventKeyDown(key, { ...options, ctrlKey: true, shiftKey: true });
}
