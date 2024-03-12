import { Command } from '@antfu/ni';
/**
 * Run the command for the given package manager in the given directory.
 * @param cwd
 * @param cmd
 * @param args
 */
export declare function runPackageCmd(cwd: string, cmd: Command, ...args: string[]): Promise<void>;
