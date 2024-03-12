import type { IParserConfig } from 'chevrotain';
export interface PrismaAstConfig {
    parser: Pick<IParserConfig, 'nodeLocationTracking'>;
}
export default function getConfig(): PrismaAstConfig;
