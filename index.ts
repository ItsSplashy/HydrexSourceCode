import * as http from "http";

import express from "express";
import { config } from "dotenv";
import { setGeneraleMiddlewares } from "./middlewares/middlewares";
import { setRoutesHandler } from "./middlewares/routesHandler";
import { startup } from "./utils/mongodb";
import { websockethandler } from "./middlewares/websocket_handler";
import { initBotWatcher } from "./bot/index.bot";

config();

startup()
  .then(() => {
    const app = express();
    const port = process.env.PORT || 7070;

    setGeneraleMiddlewares(app);
    setRoutesHandler(app);

    initBotWatcher();
    
    const server = http.createServer(app);

    websockethandler.init(server);

    server.listen(port, () => {
      console.log(`Server started on port ${port} :)`);
    });
  })
  .catch((err: string) => {
    console.error(err);
  });
