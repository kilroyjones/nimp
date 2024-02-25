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
  key: string;
  regionKey: string;
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
};

export type Player = {
  id: string;
  name: string;
};

export type Inventory = {};
