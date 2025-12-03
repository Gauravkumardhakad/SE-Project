import express from "express"
import createConnection from "./config/db.js";
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import complaintRoutes from "./routes/complaintRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app=express();

app.use(cors())
app.use(express.json());
createConnection();         // database ko connect kiya

// auth routes
app.use("/api/auth", authRoutes);

// user routes
app.use('/api/user',userRoutes);

//complain routes
app.use("/api", complaintRoutes);

// admin routes
app.use("/api/admin", adminRoutes);

app.get('/',(req,res)=>{
    res.send("listening to the port")
})

app.listen(8000);

