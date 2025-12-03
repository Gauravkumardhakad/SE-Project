import jwt from "jsonwebtoken";
import User from "../models/user.js"
import bcrypt from "bcryptjs"


// token genration function
function generateToken(user){
    const token=jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET,{"expiresIn":"7d"});
    return token;
}

// signup logic
export const registerUser=async (req,res)=>{
    console.log("Incoming register request...");
    //console.log(req.body);

    try{
        const {name, email, password,role}= req.body;
       

        const existingUser=await User.findOne({
            email:email
        });

        if(existingUser){
            return res.status(400).json({msg:"user already exist"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const user=await User.create({
            name, email, password:hashedPassword, role
        });

        const token=generateToken(user);

        res.status(200).json({
            msg:"user created successfully",
            user:{
                name,
                email,
                role
            },
            token
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            msg:"server error"
        })
    }
}

// Login logic
export const loginUser=async (req,res)=>{
    console.log("incoming login request");
    try{
        const {email, password}=req.body;

        const user=await User.findOne({
            email:email
        });

        if(!user){
            return res.status(400).json({msg:"user not found"});
        }

        const isValid=await bcrypt.compare(password,user.password);

        if(!isValid){
            return res.status(403).json({msg:"Invalid password"});
        }

        const token=generateToken(user);

        const userResponse = {
            _id: user._id,
            name: user.name, // Assuming you have a 'name' field
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            user:userResponse,
            msg:"Login successful",
            token
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({msg:"Server error"});
    }
}
