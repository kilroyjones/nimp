export declare const debug: import("@prisma/debug/dist/types").Debugger;
/**
 * Client generator resolver. The generator is shipped with the Client, so if
 * the client is not installed, it will be installed unless generation is
 * skipped.
 * @param baseDir
 * @param version
 * @returns
 */
export declare function prismaClientResolver(baseDir: string, version?: string): Promise<{
    outputPath: string;
    generatorPath: string;
    isNode: boolean;
}>;
