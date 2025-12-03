import mongoose, { Model } from "mongoose";
import { Schema } from "mongoose";
import User from "./user.js";

const complaintSchema=new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    title:String,
    description:String,
    category:String,
    department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
    },

    imageUrl:String,
    status:{type:String,enum:["Pending","In Progress","Resolved"],default:"Pending"},
    createdAt:{type:Date,default:Date.now}
})

const Complaint = mongoose.models.complaintSchema || mongoose.model("Complaint", complaintSchema);
export default Complaint;