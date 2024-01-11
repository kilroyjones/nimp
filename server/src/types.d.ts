export type Click = {
  x: number;
  y: number;
};

export type Location = {
  x: number;
  y: number;
};

export type Region = Location & {
  key: string;
};

export type DigMessage = {
  key: string;
  loc: Location;
};

export type Post = { x: number; y: number; w: number; h: number };
