/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AsyncTag } from './internals/types/async-tag';

/**
 * Represents a successful result.
 *
 * @typeParam T - The type of the successful value.
 * @typeParam M - Optional metadata type (default is `never`).
 *
 * @example
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * const success: BT.Success<number> = {
 *   type: 'Success',
 *   value: 42,
 * };
 * ```
 */
export type Success<T, M = never> = {
  readonly type: 'Success';
  readonly value: T;
  readonly __meta?: M;
};

/**
 * Represents a failed result.
 *
 * @typeParam E - The type of the error.
 * @typeParam M - Optional metadata type (default is `never`).
 *
 * @example
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * const failure: BT.Failure<string> = {
 *   type: 'Failure',
 *   error: 'Something went wrong',
 * };
 * ```
 */
export type Failure<E, M = never> = {
  readonly type: 'Failure';
  readonly error: E;
  readonly __meta?: M;
};

/**
 * A union type representing either a successful or failed result.
 *
 * @typeParam T - Success value type.
 * @typeParam E - Error type.
 * @typeParam M - Metadata type (default is `never`).
 *
 * @example
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * const doSomething = (): BT.Result<number, string> => {
 *   return Math.random() > 0.5
 *     ? { type: 'Success', value: 10 }
 *     : { type: 'Failure', error: 'Oops' };
 * };
 * ```
 */
export type Result<T, E, M = never> = Success<T, M> | Failure<E, M>;

/**
 * A `Promise` of a `Result`, marked with an `AsyncTag` to indicate it's asynchronous.
 *
 * @typeParam T - Success value type.
 * @typeParam E - Error type.
 * @typeParam M - Metadata type (default is `never`).
 *
 * @example
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * const fetchData = async (): BT.ResultAsync<string, Error> => {
 *   try {
 *     const data = await fetch('...');
 *     return { type: 'Success', value: await data.text() };
 *   } catch (err) {
 *     return { type: 'Failure', error: err as Error };
 *   }
 * };
 * ```
 */
export type ResultAsync<T, E, M = never> = Promise<Result<T, E, AsyncTag | M>>;

/**
 * A conditional type that resolves to:
 * - `Result<T, E>` for synchronous results,
 * - `Promise<Result<T, E, AsyncTag>>` for asynchronous results,
 * depending on whether metadata `M` is `AsyncTag`.
 *
 * @typeParam T - Success value type.
 * @typeParam E - Error type.
 * @typeParam M - Metadata type, which controls sync vs async.
 *
 * @example
 * For synchronous results:
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * const result: BT.ResultMaybeAsync<number, string, never> = { type: 'Success', value: 1 };
 * ```
 *
 * @example
 * For asynchronous results:
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * const result: BT.ResultMaybeAsync<number, string, AsyncTag> = Promise.resolve({ type: 'Success', value: 1 });
 * ```
 */
export type ResultMaybeAsync<T, E, M> =
  [M] extends [never] ? Result<T, E, M> :
    M extends AsyncTag ? Promise<Result<T, E, M>> :
      Result<T, E>;

/**
 * Infers the success value type from a `ResultMaybeAsync` type or a function returning one.
 *
 * @typeParam T - A `ResultMaybeAsync` type or a function returning one.
 *
 * @example
 * For a `ResultMaybeAsync` type:
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * type R = BT.Result<string, number>;
 * type Inferred = BT.InferSuccess<R>; // string
 * ```
 *
 * @example
 * For a function returning a `ResultMaybeAsync` type:
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * type F = () => BT.Result<string, number>;
 * type InferredFn = BT.InferSuccess<F>; // string
 * ```
 */
export type InferSuccess<R> =
  R extends (...args: any[]) => ResultMaybeAsync<infer U, any, any> ? U :
    R extends ResultMaybeAsync<infer U, any, any> ? U :
      never;

/**
 * Infers the failure value type from a `ResultMaybeAsync` type or a function returning one.
 *
 * @typeParam T - A `ResultMaybeAsync` type or a function returning one.
 *
 * @example
 * For a `ResultMaybeAsync` type:
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * type R = BT.Result<string, number>;
 * type Inferred = BT.InferFailure<R>; // number
 * ```
 *
 * @example
 * For a function returning a `ResultMaybeAsync` type:
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * type F = () => BT.Result<string, number>;
 * type Inferred = BT.InferFailure<F>; // number
 * ```
 */
export type InferFailure<R> =
  R extends (...args: any[]) => ResultMaybeAsync<any, infer U, any> ? U :
    R extends ResultMaybeAsync<any, infer U, any> ? U :
      never;

/**
 * Infers the metadata type from a `ResultMaybeAsync` type or a function returning one.
 *
 * @typeParam T - A `ResultMaybeAsync` type or a function returning one.
 *
 * @example
 * For a `ResultMaybeAsync` type:
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * type R = BT.Result<string, number, AsyncTag>;
 * type Inferred = BT.InferMeta<R>; // AsyncTag
 * ```
 *
 * @example
 * For a function returning a `ResultMaybeAsync` type:
 * ```ts
 * import { BT } from '@praha/byethrow';
 *
 * type F = () => BT.Result<string, number, AsyncTag>;
 * type Inferred = BT.InferMeta<F>; // AsyncTag
 * ```
 */
export type InferMeta<R> =
  R extends (...args: any[]) => ResultMaybeAsync<any, any, infer A> ? A :
    R extends ResultMaybeAsync<any, any, infer A> ? A :
      never;
