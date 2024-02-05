export const DIG_WIDTH: number = 64;
export const DIG_HEIGHT: number = 64;
export const REGION_WIDTH: number = 3200;
export const REGION_HEIGHT: number = 2048;
export const REGION_WIDTH_DIGS: number = Math.floor(REGION_WIDTH / DIG_WIDTH);
export const REGION_HEIGHT_DIGS: number = Math.floor(REGION_HEIGHT / DIG_HEIGHT);
export const UPDATE_DISTANCE: number = 200;

export enum DigStatus {
  UNCLAIMED = "0",
  UNKNOWN = "U",
}

export const DigStatusMap: Record<string, DigStatus> = {
  [DigStatus.UNCLAIMED]: DigStatus.UNCLAIMED,
};
