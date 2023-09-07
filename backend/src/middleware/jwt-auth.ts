import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import HttpError, { StatusCodes } from "../errors/http-error";
import env from "../utils/validated-env";

const jwtAuth: RequestHandler = (req, res, next) => {
    const token = req.cookies.access_token;

    try {
        if (!token)
            throw new HttpError(StatusCodes.UNAUTHORIZED, "Token required.");

        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie("access_token");
        next(error);
    }
};

export default jwtAuth;
