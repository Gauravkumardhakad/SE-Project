import mongoose, { mongo } from "mongoose";

export default async function createConnection(){
    try{
       // await mongoose.connect("mongodb+srv://dhakadgauravkumar_db_user:pass%40municipal@cluster0");
       await mongoose.connect("mongodb://localhost:27017/municipal")
        console.log("connected successfully");
    }
    catch(err){
        console.log(err);
    }
    
}


