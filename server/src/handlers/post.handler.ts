/**
 *
 * TODO:
 *  - Transfer the parsing of Digs to the key->locs list to the front side to
 *  trim down computations on this side.
 *
 * - Combine the getTopLeftLocation with createDimensionMap if this stays after
 * the above bullet it handles.
 *
 */
// Modules
import logger from "../service/server/logging.service";

import { Server } from "socket.io";

// Types
import { PostRequest } from "$shared/messages";
import { RegionDatabase } from "src/database/region.database";

const post = async (io: Server, postRequest: PostRequest) => {
  console.log("Addding", postRequest.regionKey);
  console.log("Addding", postRequest.postKey);
  console.log("Addding", postRequest.content);
  const region = await RegionDatabase.get(postRequest.regionKey);
  if (region) {
    RegionDatabase.updatePost(region.key, postRequest.postKey, postRequest.content);
    io.to(region.key).emit("update-posts", { regionKey: region.key, post: postRequest });
  }
};

export const PostHandler = {
  post,
};
