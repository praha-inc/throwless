/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return */

import { isPromise } from '../internals/helpers/is-promise';

import type { AsyncTag } from '../internals/types/async-tag';
import type { ResultMaybeAsync } from '../result';

/**
 * Creates a `Failure` result from a given error.
 * If the input error is a `Promise`, the result becomes asynchronous and is wrapped in a `Promise<Result<...>>`
 * with an `AsyncTag` as metadata. Otherwise, it returns a synchronous `Failure` result.
 *
 * @typeParam E - The error type.
 * @typeParam M - Optional metadata type (inferred as `AsyncTag` if `E` is a Promise).
 *
 * @param error - The error value.
 * @returns A `ResultMaybeAsync` representing failure.
 *
 * @example
 * For synchronous error:
 * import { BT } from '@praha/byethrow';
 *
 * const result = BT.fail(new Error('Oops'));
 * // Result<never, Error>
 * ```
 *
 * @example
 * For asynchronous error:
 * import { BT } from '@praha/byethrow';
 *
 * const result = BT.fail(Promise.resolve(new Error('Network error')));
 * // Promise<Result<never, Error, AsyncTag>>
 * ```
 */
export const fail = <E, M = E extends Promise<unknown> ? AsyncTag : never>(
  error: E,
): ResultMaybeAsync<never, E extends Promise<unknown> ? Awaited<E> : E, M> => {
  if (isPromise(error)) {
    return error.then((error) => ({ type: 'Failure', error: error })) as any;
  }
  return { type: 'Failure', error } as any;
};
