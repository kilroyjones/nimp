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
  const region = await RegionDatabase.get(postRequest.regionKey);
  if (region) {
    const updatedRegion = await RegionDatabase.updatePost(
      region.key,
      postRequest.postKey,
      postRequest.content
    );

    if (updatedRegion) {
      const post = await RegionDatabase.getPost(postRequest.regionKey, postRequest.postKey);
      console.log("REGION", region.key);
      console.log("POST", post);
      if (post) {
        const ext = post[postRequest.postKey];
        console.log("PARSED: ", ext);
        if (ext) {
          io.to(region.key).emit("update-posts", { regionKey: region.key, post: ext });
        }
      }
    }
  }
};

export const PostHandler = {
  post,
};
