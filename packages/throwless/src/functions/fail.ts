/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return */

import { isPromise } from '../internals/helpers/is-promise';

import type { AsyncTag } from '../internals/types/async-tag';
import type { ResultMaybeAsync } from '../result';

/**
 * Wraps a value in a `Failure` result.
 * If the input error is a `Promise`, the result becomes asynchronous and is wrapped in a `Promise<Result<...>>`
 * with an `AsyncTag` as metadata. Otherwise, it returns a synchronous `Failure` result.
 *
 * @typeParam E - The type of the error. Maybe a `Promise` or a plain value.
 * @typeParam M - Optional metadata. Defaults to `AsyncTag` if `E` is a `Promise`, otherwise `never`.
 *
 * @param error - The error to wrap in a `Failure` result. Can be a Promise or a regular value.
 * @returns A `ResultMaybeAsync` that resolves to a `Failure` result containing the error.
 *
 * @example
 * // Synchronous example:
 * const syncFailure = fail('Something went wrong');
 * // syncFailure is of type Result<never, string>
 *
 * // Asynchronous example:
 * const asyncFailure = fail(Promise.resolve(new Error('Network error')));
 * // asyncFailure is of type Promise<Result<never, Error, AsyncTag>>
 */
export const fail = <E, M = E extends Promise<unknown> ? AsyncTag : never>(
  error: E,
): ResultMaybeAsync<never, E extends Promise<unknown> ? Awaited<E> : E, M> => {
  if (isPromise(error)) {
    return error.then((error) => ({ type: 'Failure', error: error })) as any;
  }
  return { type: 'Failure', error } as any;
};
