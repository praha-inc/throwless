/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return */

import { isPromise } from '../internals/helpers/is-promise';

import type { AsyncTag } from '../internals/types/async-tag';
import type { ResultMaybeAsync } from '../result';

/**
 * Creates a `Success` result from a given value.
 * If the input value is a `Promise`, the result becomes asynchronous and is wrapped in a `Promise<Result<...>>`
 * with an `AsyncTag` as metadata. Otherwise, it returns a synchronous `Success` result.
 *
 * @typeParam T - The value type.
 * @typeParam M - Optional metadata type (inferred as `AsyncTag` if `T` is a Promise).
 *
 * @param value - The success value.
 * @returns A `ResultMaybeAsync` representing success.
 *
 * @example
 * For synchronous value:
 * import { BT } from '@praha/byethrow';
 *
 * const result = BT.succeed(42);
 * // Result<number, never>
 * ```
 *
 * @example
 * For asynchronous value:
 * import { BT } from '@praha/byethrow';
 *
 * const result = BT.succeed(Promise.resolve('hello'));
 * // Promise<Result<string, never, AsyncTag>>
 * ```
 */
export const succeed = <T, M = T extends Promise<unknown> ? AsyncTag : never>(
  value: T,
): ResultMaybeAsync<T extends Promise<unknown> ? Awaited<T> : T, never, M> => {
  if (isPromise(value)) {
    return value.then((value) => ({ type: 'Success', value: value })) as any;
  }
  return { type: 'Success', value } as any;
};
