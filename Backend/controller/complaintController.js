import Complaint from "../models/complaint.js"

// complaint create krenge
export const createComplaint = async (req, res) => {
  try {
    console.log("📩 Incoming complaint:", req.body);
    //console.log("📸 Uploaded file:", req.file);

    const { title, description, category, department } = req.body;

    if (!title || !description || !category || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const complaintData = {
      title,
      description,
      category,
      department,
      user: req.user._id,
      status: "Pending",
    };

    

    const complaint = await Complaint.create(complaintData);
    res.status(201).json({ message: "Complaint created", complaint });
  } catch (err) {
    console.error("❌ createComplaint error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// get all compaints (for admin)
export const getAllComplaints=async (req,res)=>{
    try{
        const role=req.user.role;

        if(role!=="admin"){
            return res.status(403).json({
                msg:"only admin allowed"
            })
        }

        const complaints = await Complaint.find()
        .populate("user", "name email")               // citizen details
        .populate("department", "name email head") 

        //console.log(complaints);
        res.status(200).json({complaints});
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"intenal server error"});
    }
} 

// get complaints of specific user
export const getMyComplaints=async (req,res)=>{
    try{
        console.log(req.user);
        const complaints=await Complaint.find({user: req.user._id}).populate("department", "name email head");
        console.log(complaints);
        res.status(200).json({complaints});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error fetching complaints" });
    }
}

// Return summary counts for the logged-in citizen
export const getMyComplaintSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalComplaints = await Complaint.countDocuments({ user: userId });
    const pending = await Complaint.countDocuments({ user: userId, status: "Pending" });
    const resolved = await Complaint.countDocuments({ user: userId, status: "Resolved" });

    res.json({
      totalComplaints,
      pending,
      resolved,
    });
  } catch (err) {
    console.error("Error in getMyComplaintSummary:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// update the complaint's status ( by admin)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;
    await complaint.save();

    res.status(200).json({ message: "Status updated", complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete complaint
export const deleteComplaint = async (req, res) => {
    console.log("i am in a delete complaint route");
  try {
    const { id } = req.params;
    const deleted = await Complaint.findByIdAndDelete(id);
   // console.log(deleted);
    if (!deleted) return res.status(404).json({ message: "Complaint not found" });
    console.log("complaint deleted");

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
