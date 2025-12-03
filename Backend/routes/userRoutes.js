import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserInfo, updateUser, changePassword } from "../controller/userController.js";

const router = express.Router();

router.get("/me", protect, getUserInfo);
router.put("/update", protect, updateUser);
router.put("/change-password", protect, changePassword);

export default router;
