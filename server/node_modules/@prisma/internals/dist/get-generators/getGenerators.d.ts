import type { BinaryTargetsEnvValue, EngineType, GeneratorConfig } from '@prisma/generator-helper';
import type { Platform } from '@prisma/get-platform';
import { Generator } from '../Generator';
import type { GeneratorPaths } from './generatorResolvers/generatorResolvers';
export type ProviderAliases = {
    [alias: string]: GeneratorPaths;
};
type BinaryPathsOverride = {
    [P in EngineType]?: string;
};
export type GetGeneratorOptions = {
    schemaPath: string;
    providerAliases?: ProviderAliases;
    cliVersion?: string;
    version?: string;
    printDownloadProgress?: boolean;
    baseDir?: string;
    overrideGenerators?: GeneratorConfig[];
    skipDownload?: boolean;
    binaryPathsOverride?: BinaryPathsOverride;
    generatorNames?: string[];
    postinstall?: boolean;
    noEngine?: boolean;
};
/**
 * Makes sure that all generators have the binaries they deserve and returns a
 * `Generator` class per generator defined in the schema.prisma file.
 * In other words, this is basically a generator factory function.
 * @param schemaPath Path to schema.prisma
 * @param aliases Aliases like `prisma-client-js` -> `node_modules/@prisma/client/generator-build/index.js`
 */
export declare function getGenerators(options: GetGeneratorOptions): Promise<Generator[]>;
type NeededVersions = {
    [key: string]: {
        engines: EngineType[];
        binaryTargets: BinaryTargetsEnvValue[];
    };
};
export type GetBinaryPathsByVersionInput = {
    neededVersions: NeededVersions;
    platform: Platform;
    version?: string;
    printDownloadProgress?: boolean;
    skipDownload?: boolean;
    binaryPathsOverride?: BinaryPathsOverride;
};
/**
 * Shortcut for getGenerators, if there is only one generator defined. Useful for testing.
 * @param schemaPath path to schema.prisma
 * @param aliases Aliases like `photonjs` -> `node_modules/photonjs/gen.js`
 * @param version Version of the binary, commit hash of https://github.com/prisma/prisma-engine/commits/master
 * @param printDownloadProgress `boolean` to print download progress or not
 */
export declare function getGenerator(options: GetGeneratorOptions): Promise<Generator>;
export declare function skipIndex<T = any>(arr: T[], index: number): T[];
export declare const knownBinaryTargets: Platform[];
export {};
