import User from "../models/user.js";
import Complaint from "../models/complaint.js";
import Department from "../models/department.js"

// Dashboard ke liye stats
export const getStats=async (req,res)=>{
    try{

        if(req.user.role!=="admin"){
            return res.status(403).json({msg:"only admin allowed"});
        }

        const totalUsers = await User.countDocuments();
        const totalComplaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
        const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });
        const departments = await Department.countDocuments();

        res.status(200).json({
            message: "Admin dashboard stats fetched successfully",
            stats: {
                totalUsers,
                totalComplaints,
                pendingComplaints,
                resolvedComplaints,
                departments,
            },
        });

    }
    catch(err){
        console.error(err);
        res.status(500).json({msg:"internal server error"});
    }
}

// get recent complaints
export const getRecentComplaints = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("department", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Recent complaints fetched successfully",
      complaints: complaints.map((c) => ({
        _id: c._id,
        title: c.title,
        department: c.department?.name || "N/A",
        status: c.status,
        createdAt: c.createdAt,
        user: c.user?.name || "Anonymous",
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }

        const users = await User.find().select("-password");
        res.status(200).json({ message: "All users fetched successfully", users });
    } catch (err) {
        console.error(err);
        res.status(500).json({msg:"internal server error"});
    }
};

// get all departments
export const getDepartments = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }

        const departments = await Department.find().populate("complaints");
        res.status(200).json({ message: "Departments fetched successfully", departments });
    } catch (err) {
        console.error(err);
        res.status(500).json({msg:"internal server error"});
    }
};


// Get complaint count by department
export const getComplaintsByDepartment = async (req, res) => {
  try {
    const summary = await Complaint.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "departmentInfo",
        },
      },
      {
        $project: {
          _id: 0,
          name: { $arrayElemAt: ["$departmentInfo.name", 0] },
          complaints: "$count",
        },
      },
    ]);

    res.status(200).json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaints by department" });
  }
};

// monthly trend
export const getComplaintTrends = async (req, res) => {
  try {
    const trends = await Complaint.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          resolved: 1,
          pending: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json(trends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaint trends" });
  }
};
