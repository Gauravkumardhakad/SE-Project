import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getMyComplaintSummary
} from "../controller/complaintController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Citizen routes
router.post("/complaints", protect, createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/my/summary", protect, getMyComplaintSummary);

// Admin routes
router.get("/admin/complaints", protect, getAllComplaints);
router.put("/admin/complaints/:id/status", protect, updateComplaintStatus);
router.delete("/admin/complaints/:id", protect, deleteComplaint);

export default router;
