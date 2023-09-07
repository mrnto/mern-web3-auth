import cookieParser from "cookie-parser";
import express from "express";
import HttpError, { StatusCodes } from "./errors/http-error";
import errorHandler from "./middleware/error-handler";
import usersRoutes from "./routes/users";

const app = express();
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api/users", usersRoutes);
// Error Handling
app.use((_req, _res, next) => {
    next(new HttpError(StatusCodes.NOT_FOUND, "Route not found."));
});
app.use(errorHandler);

export default app;
