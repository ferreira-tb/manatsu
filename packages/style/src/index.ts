import { trimArray } from '@tb-dev/utils';

export function css(text: TemplateStringsArray, ...subs: unknown[]): Record<string, string> {
  const result: Record<string, string> = {};

  const rules = String.raw(text, ...subs).replace(/\/\*[^]*?\*\//g, '');

  for (const rule of rules.split(/;(?![^(]*\))/g)) {
    const [key, value] = trimArray(rule.split(/:([^]+)/));
    if (key && value) {
      result[key] = value;
    }
  }

  return result;
}
