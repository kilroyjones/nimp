/**
 * Warn, if typescript is below `4.1.0` and is installed locally because
 * template literal types are required for generating Prisma Client types.
 * https://www.prisma.io/docs/reference/system-requirements#software-requirements
 */
export declare function checkTypeScriptVersion(): Promise<void>;
