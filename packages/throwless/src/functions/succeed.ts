/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return */

import { isPromise } from '../internals/helpers/is-promise';

import type { AsyncTag } from '../internals/types/async-tag';
import type { ResultMaybeAsync } from '../result';

/**
 * Wraps a value in a `Success` result.
 * If the input value is a `Promise`, the result becomes asynchronous and is wrapped in a `Promise<Result<...>>`
 * with an `AsyncTag` as metadata. Otherwise, it returns a synchronous `Success` result.
 *
 * @typeParam T - The type of the value. Maybe a `Promise` or a plain value.
 * @typeParam M - Optional metadata. Defaults to `AsyncTag` if `T` is a `Promise`, otherwise `never`.
 *
 * @param value - The value to wrap in a `Success` result. Can be a Promise or a regular value.
 * @returns A `ResultMaybeAsync` that resolves to a `Success` result containing the value.
 *
 * @example
 * // Synchronous example:
 * const syncSuccess = succeed(123);
 * // syncSuccess is of type Result<number, never>
 *
 * // Asynchronous example:
 * const asyncSuccess = succeed(Promise.resolve('hello'));
 * // asyncSuccess is of type Promise<Result<string, never, AsyncTag>>
 */
export const succeed = <T, M = T extends Promise<unknown> ? AsyncTag : never>(
  value: T,
): ResultMaybeAsync<T extends Promise<unknown> ? Awaited<T> : T, never, M> => {
  if (isPromise(value)) {
    return value.then((value) => ({ type: 'Success', value: value })) as any;
  }
  return { type: 'Success', value } as any;
};
