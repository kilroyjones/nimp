import type { DataSource, DMMF, GeneratorConfig } from '@prisma/generator-helper';
import { QueryEngineErrorInit } from './queryEngineCommons';
export interface ConfigMetaFormat {
    datasources: DataSource[];
    generators: GeneratorConfig[];
    warnings: string[];
}
export type GetDMMFOptions = {
    datamodel?: string;
    cwd?: string;
    prismaPath?: string;
    datamodelPath?: string;
    retry?: number;
    previewFeatures?: string[];
};
export declare class GetDmmfError extends Error {
    constructor(params: QueryEngineErrorInit);
}
/**
 * Wasm'd version of `getDMMF`.
 */
export declare function getDMMF(options: GetDMMFOptions): Promise<DMMF.Document>;
