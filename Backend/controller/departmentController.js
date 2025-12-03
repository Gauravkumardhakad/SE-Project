import Department from "../models/department.js";

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    // if (req.user.role !== "admin")
    //   return res.status(403).json({ message: "Access denied: Admin only" });

    const departments = await Department.find().sort({ createdAt: -1 });
    console.log("departments =",departments);
    res.status(200).json({ message: "Departments fetched", departments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add department
export const addDepartment = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const department = await Department.create(req.body);
    res.status(201).json({ message: "Department added", department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!department)
      return res.status(404).json({ message: "Department not found" });

    res.status(200).json({ message: "Department updated", department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete department
export const deleteDepartment = async (req, res) => {
    console.log("i am in delete department");
    console.log(req.params.id);
  try {
    
    const { id } = req.params;
    const deleted = await Department.findByIdAndDelete(id);
    console.log(deleted);
    if (!deleted)
      return res.status(404).json({ message: "Department not found" });

    res.status(200).json({ message: "Department deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
