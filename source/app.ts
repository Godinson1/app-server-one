import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import HttpStatus from "http-status-codes";
import helmet from "helmet";
import compression from "compression";
import passport from "passport";

import { ResponseError, handleError } from "./Error";
import { router as AuthRouter } from "./Authentication";
import { router as UserRouter } from "./User/routes";
import { router as PostRouter } from "./Post/routes";
require("./Authentication/passport");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use(passport.initialize());

//Define Routes
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);
app.use("/posts", PostRouter);

// setting fall back route and message for undefined route
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found") as ResponseError;
  error.status = HttpStatus.NOT_FOUND;
  next(error);
});

//Error handler helper
app.use(
  (
    err: { statusCode: number; message: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    handleError(
      { statusCode: HttpStatus.NOT_FOUND, message: "Route not found!" },
      res
    );
    next();
  }
);

// setting fall back message for other uncaught errors in app
app.use(
  (
    error: { message: string; status: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        message: error.message,
      },
    });
    next();
  }
);

export { app };
