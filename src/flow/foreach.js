import { getByPath } from './utils.js';

async function toArray(maybeIterable) {
  if (!maybeIterable) return [];
  if (Array.isArray(maybeIterable)) return maybeIterable;
  if (typeof maybeIterable[Symbol.asyncIterator] === 'function') {
    const collected = [];
    for await (const item of maybeIterable) collected.push(item);
    return collected;
  }
  if (typeof maybeIterable[Symbol.iterator] === 'function') {
    return [...maybeIterable];
  }
  return [];
}

export async function flowForeach(ctx, input = {}, meta = {}) {
  const list = await toArray(input.list ?? input.stream ?? []);
  const results = [];

  if (list.length === 0) {
    const elseState = await ctx.runSlot('else', undefined, { item: undefined, index: -1 });
    if (meta.collectPath) {
      const val = getByPath({ $: elseState, $slot: { item: undefined, index: -1 } }, meta.collectPath);
      if (typeof val !== 'undefined') results.push(val);
    }
    return { results };
  }

  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    try {
      const iterState = await ctx.runSlot('body', undefined, { item, index });
      if (meta.collectPath) {
        const val = getByPath({ $: iterState, $slot: { item, index } }, meta.collectPath);
        results.push(val);
      } else {
        results.push(iterState);
      }
    } catch (err) {
      if (err && err.$signal === 'continue') continue;
      if (err && err.$signal === 'break') break;
      throw err;
    }
  }

  return { results };
}
