export const isPromise = <T>(value: T | Promise<T>): value is Promise<T> => {
  return (
    typeof value === 'object'
    && value !== null
    && 'then' in value
    && typeof value.then === 'function'
    && 'catch' in value
    && typeof value.catch === 'function'
  );
};
