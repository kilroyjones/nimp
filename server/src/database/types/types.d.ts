import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Inventories = {
    id: string;
    dirt: Generated<number>;
};
export type Players = {
    id: Generated<string>;
    name: string;
    password: string;
    token: Generated<string>;
    registered: Generated<boolean>;
    email: string | null;
};
export type Regions = {
    id: Generated<number>;
    key: string;
    x: number;
    y: number;
    founder: string;
    odds: number;
    digs: string;
    /**
     * @kyselyType(JSON)
     */
    posts: JSON;
};
export type Spellbooks = {
    id: string;
};
export type DB = {
    Inventories: Inventories;
    Players: Players;
    Regions: Regions;
    Spellbooks: Spellbooks;
};
