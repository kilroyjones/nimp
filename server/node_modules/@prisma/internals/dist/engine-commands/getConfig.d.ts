import type { DataSource, EnvValue, GeneratorConfig } from '@prisma/generator-helper';
import { QueryEngineErrorInit } from './queryEngineCommons';
export interface ConfigMetaFormat {
    datasources: DataSource[] | [];
    generators: GeneratorConfig[] | [];
    warnings: string[] | [];
}
export type GetConfigOptions = {
    datamodel: string;
    cwd?: string;
    prismaPath?: string;
    datamodelPath?: string;
    retry?: number;
    ignoreEnvVarErrors?: boolean;
};
export declare class GetConfigError extends Error {
    constructor(params: QueryEngineErrorInit);
}
export declare function getEffectiveUrl(ds: DataSource): EnvValue;
export declare function getDirectUrl(ds: DataSource): EnvValue | undefined;
export declare function resolveUrl(envValue: EnvValue | undefined): string | undefined;
/**
 * Wasm'd version of `getConfig`.
 */
export declare function getConfig(options: GetConfigOptions): Promise<ConfigMetaFormat>;
