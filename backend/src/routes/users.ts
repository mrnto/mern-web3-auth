import express from "express";
import * as UsersController from "../controllers/users";
import jwtAuth from "../middleware/jwt-auth";

const router = express.Router();

router.get("/", jwtAuth, UsersController.getAuthenticatedUser);
router.patch("/username", jwtAuth, UsersController.updateUsername);
router.post("/nonce", UsersController.getNonce);
router.post("/signature", UsersController.signIn);

export default router;
