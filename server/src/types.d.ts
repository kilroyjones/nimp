import { Location } from "$shared/types";
import { UpdateDigResponse } from "$shared/messages";
import type { Post } from "$shared/types";

// import { Post } from "./database/claim.database";

// export type Post = {
//   postKey: string;
//   loc: Location;
//   width: number;
//   height: number;
//   content: string;
// };

type PostsMap = Record<string, Post>;
