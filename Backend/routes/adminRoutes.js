import express from "express";
import { getStats, getAllUsers, getRecentComplaints, getComplaintsByDepartment,
  getComplaintTrends, } from "../controller/adminController.js";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controller/departmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only routes
router.get("/stats", protect, getStats);
router.get("/users", protect, getAllUsers);
router.get("/recent-complaints", protect, getRecentComplaints);
router.get("/complaints/summary", protect, getComplaintsByDepartment);
router.get("/complaints/trends", protect, getComplaintTrends);

router.get("/departments", protect, getDepartments);
router.post("/departments", protect, addDepartment);
router.put("/departments/:id", protect, updateDepartment);
router.delete("/departments/:id", protect, deleteDepartment);



export default router;
