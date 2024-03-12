import { default as _resolve } from 'resolve';
/**
 * Alternative to `require.resolve` that returns undefined instead of throwing.
 * It also enables preserving symlinks, which is not possible with the original
 * `require.resolve`. This variant will find the _entrypoint_ of a package.
 * @param id
 * @param options
 * @returns
 */
declare function resolve(id: string, options: _resolve.AsyncOpts): Promise<string | undefined>;
/**
 * Alternative to `require.resolve` that returns undefined instead of throwing.
 * It also enables preserving symlinks, which is not possible with the original
 * `require.resolve`. This variant will find the _root_ of a package.
 * @param id
 * @param options
 * @returns
 */
declare function resolvePkg(id: string, options: _resolve.AsyncOpts): Promise<string | undefined>;
export { resolve, resolvePkg };
