import { QueryEngineErrorInit } from './queryEngineCommons';
export type ValidateOptions = {
    datamodel: string;
};
export declare class ValidateError extends Error {
    constructor(params: QueryEngineErrorInit);
}
/**
 * Wasm'd version of `validate`.
 */
export declare function validate(options: ValidateOptions): void;
