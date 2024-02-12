import { Location } from "$shared/types";
import { UpdateDigResponse } from "$shared/messages";
import { Post } from "./database/claim.database";

export type Post = {
  regionKey: string;
  postKey: string;
  loc: Location;
  width: number;
  height: number;
  content: string;
};

type PostsMap = Record<string, Post>;
