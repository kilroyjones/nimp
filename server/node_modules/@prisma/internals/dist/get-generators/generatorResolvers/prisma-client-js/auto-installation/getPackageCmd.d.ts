import { Command } from '@antfu/ni';
/**
 * Get the command to run for the given package manager in the given directory.
 * @param cwd
 * @param cmd
 * @param args
 * @returns
 */
export declare function getPackageCmd(cwd: string, cmd: Command, ...args: string[]): Promise<string>;
