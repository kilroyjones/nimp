export const DIG_WIDTH: number = 64;
export const DIG_HEIGHT: number = 64;
export const REGION_WIDTH: number = 3200;
export const REGION_HEIGHT: number = 2048;
export const REGION_WIDTH_DIGS: number = Math.floor(REGION_WIDTH / DIG_WIDTH);
export const REGION_HEIGHT_DIGS: number = Math.floor(REGION_HEIGHT / DIG_HEIGHT);
export const UPDATE_DISTANCE: number = 400;

export enum DigStatus {
  UNDUG = "0",
  DUG = "D",
  UNCLAIMED = "U",
  CLAIMED = "C",
}

export const DigStatusMap: Record<string, DigStatus> = {
  [DigStatus.UNDUG]: DigStatus.UNDUG,
  [DigStatus.UNCLAIMED]: DigStatus.UNCLAIMED,
  [DigStatus.CLAIMED]: DigStatus.CLAIMED,
};
