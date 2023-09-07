import { Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import env from "../utils/validated-env";

interface User {
    _id: mongoose.Types.ObjectId;
    address: string;
}

const generateJwt = (res: Response, user: User) => {
    const token = jwt.sign({
        userId: user._id,
        address: user.address,
    }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION });

    res.cookie("access_token", token, {
        httpOnly: true,
        secure: env.NODE_ENV !== "development",
        sameSite: "strict",
    });
};

export { generateJwt };
