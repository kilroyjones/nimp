/**
 * Warn, if yarn is older than 1.19.2 because Yarn used to remove all dot
 * folders inside node_modules before. We use node_modules/.prisma/client
 * directory as default location for generated Prisma Client. Changelog
 * https://github.com/yarnpkg/yarn/blob/HEAD/CHANGELOG.md#1192
 * https://www.prisma.io/docs/reference/system-requirements#software-requirements
 * // TODO Maybe we replace this with the "engines" field in package.json
 */
export declare function checkYarnVersion(): void;
