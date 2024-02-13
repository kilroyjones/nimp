import type { DigStatus } from "./constants";

export type Location = {
  x: number;
  y: number;
};

export type DigSite = {
  idx: number;
  status: DigStatus;
};

export type Bounds = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type SelectedDig = {
  loc: Location;
  key: string;
};

export type Post = {
  postKey: string;
  loc: Location;
  width: number;
  height: number;
  content: string;
};
