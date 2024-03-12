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
  i: boolean;
  content: string;
};

export type Player = {
  id: string;
  name: string;
  registered: boolean;
  token: string;
};

export type Resources = {
  dirt: number;
};

export type Spellbook = {};

export type Inventory = {
  resources: Resources;
  spellbook: Spellbook;
};
