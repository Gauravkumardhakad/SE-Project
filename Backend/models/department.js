import mongoose, { Model } from "mongoose";
import { Schema } from "mongoose";
import Complaint from "./complaint.js";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    head: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    description: { type: String },
    complaintCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Department=mongoose.models.departmentSchema || mongoose.model("Department",departmentSchema);

export default Department;