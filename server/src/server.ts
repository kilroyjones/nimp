/**
 * This is our server, which is used to track users and their location in the
 * world.  We are using "rooms" to track what regions are currently in view,
 * while relying on the socket event name to determine what to do with the
 * incoming data.
 *
 * Here, aside from connection and disconnect, we only impleent updateRegion.
 */

import express from "express";

// Moddules
import cookieParser from "cookie-parser";
import { createServer } from "http";
import cors from "cors";

// Typical server setup
const PORT = 3000;
const app = express();
app.use(cors());
app.use(cookieParser());

export const httpServer = createServer(app);

// Connect websocket server
import "./sockets/play.socket";

// Routes
import AccountRoutes from "./routes/account.route";

app.use("/account", AccountRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
