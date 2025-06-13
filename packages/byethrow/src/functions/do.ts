import { succeed } from './succeed';

/**
 * A alias for `succeed({})`, useful for initiating monadic-style chaining.
 *
 * @example
 * import { BT } from '@praha/byethrow';
 *
 * const result = BT.do; // Result<{}, never>
 * ```
 */
const do_ = succeed({});

export { do_ as do };
