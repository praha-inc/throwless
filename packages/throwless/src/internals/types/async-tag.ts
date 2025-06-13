declare const symbol: unique symbol;

/**
 * Marker interface used to indicate an asynchronous `Result`.
 *
 * The presence of this tag allows type utilities like `ResultMaybeAsync` to differentiate between
 * synchronous and asynchronous `Result` wrappers.
 */
export type AsyncTag = { readonly [symbol]: typeof symbol };
