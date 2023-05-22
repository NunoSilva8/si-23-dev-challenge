import express, {
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import { RegisterRoutes } from "../build/routes";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { ErrorResponse } from "./interfaces/responses/error";
import mongoose, { MongooseError } from "mongoose";

export const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

// DATABASE
mongoose
  .set("strictQuery", false)
  .connect("mongodb://127.0.0.1:27017/SI-23-DEV-CHALLENGE", {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
  })
  .catch((error: MongooseError) => {
    console.error(error);
  });

// SWAGGER UI
app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});

// GENERATES ROUTES
RegisterRoutes(app);

// INVALID ROUTES
app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({
    message: "Not Found",
  });
});

// THROWN ERRORS
app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: "Input Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof ErrorResponse) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof SyntaxError) {
    return res
      .status(422)
      .json({ message: "Error parsing the sent data.", details: err.message });
  }
  if (err instanceof Error) {
    console.warn(req.path, err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});
