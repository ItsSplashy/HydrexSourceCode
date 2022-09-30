import { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import BodyParser from "body-parser";
import cookieParser from "cookie-parser";

export const setGeneraleMiddlewares = (app: Application): void => {
  app.set("trust proxy", 1);
  app.use(cookieParser());
  app.use(cors());
  app.use(helmet());
  app.use(
    BodyParser.json({
      limit: "5mb",
    }),
  );
};
