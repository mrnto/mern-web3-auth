import jwt from "jsonwebtoken";
import mongoose from "mongoose";

declare module "jsonwebtoken" {
    interface JwtPayload {
        userId: mongoose.Types.ObjectId;
        address: string;
    }
}
