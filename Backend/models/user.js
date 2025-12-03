import mongoose, { Model } from "mongoose";
import { Schema } from "mongoose";

const userSchema=new Schema({
    name:String,
    email:String,
    password:String,
    role:{type:String,enum:["citizen","admin","official"],default:"citizen"},
})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
