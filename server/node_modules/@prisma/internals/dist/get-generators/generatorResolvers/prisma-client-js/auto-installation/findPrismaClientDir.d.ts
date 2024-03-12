/**
 * Tries to find a `@prisma/client` that is next to the `prisma` CLI
 * @param baseDir from where to start looking from
 * @returns `@prisma/client` location
 */
export declare function findPrismaClientDir(baseDir: string): Promise<string | undefined>;
