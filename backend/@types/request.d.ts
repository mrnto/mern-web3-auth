import express from "express-serve-static-core";
import mongoose from "mongoose";

interface User {
    userId: mongoose.Types.ObjectId;
    address: string;
}

declare module "express-serve-static-core" {
    interface Request {
        user: User;
    }
}
