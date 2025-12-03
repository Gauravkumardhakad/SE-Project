import express from "express";
import { registerUser, loginUser } from "../controller/authController.js";

const router = express.Router();

console.log("i am in auth routes");

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;