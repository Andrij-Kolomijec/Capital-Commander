import express from "express";

import { userLogin, userSignup } from "../controllers/userController";

const userRoutes = express.Router();

userRoutes.post("/login", userLogin);

userRoutes.post("/signup", userSignup);

export default userRoutes;
