import User from "../models/user.model.js";
import MessAttendence from "../models/messattendence.model.js";
import Outpass from "../models/outpass.model.js";

export const viewIDByRoll = async (req, res) => {
  let { roll } = req.params;
  try {
    roll = roll.toUpperCase();
    const user = await User.findOne({ roll });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user details (excluding sensitive information like password)
    const userDetails = {
      name: user.name,
      roll: user.roll,
      email: user.email,
      phone: user.phone,
      room: user.room,
      role: user.role,
      profilePicture: user.profilePicture,
      fName: user.fName,
      cgpi: user.cgpi,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };

    res.status(200).json({
      message: `User details retrieved for roll number ${roll}`,
      user: userDetails,
    });
  } catch (error) {
    console.error("Error in viewIDByRoll:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markMessAttendence = async (req, res) => {
  let { roll } = req.params;
  const { date, attendance } = req.body;
  
  try {
    roll = roll.toUpperCase();
    const user = await User.findOne({ roll });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate attendance data
    if (!attendance || typeof attendance !== 'object') {
      return res.status(400).json({ 
        message: "Attendance data is required and must be an object with at least one meal (breakfast, lunch, or dinner)" 
      });
    }

    const { breakfast, lunch, dinner } = attendance;

    // At least one meal must be provided
    if (breakfast === undefined && lunch === undefined && dinner === undefined) {
      return res.status(400).json({ 
        message: "At least one meal attendance (breakfast, lunch, or dinner) must be provided" 
      });
    }

    // Validate the provided meal fields are boolean
    if (breakfast !== undefined && typeof breakfast !== 'boolean') {
      return res.status(400).json({ message: "breakfast must be a boolean value" });
    }
    if (lunch !== undefined && typeof lunch !== 'boolean') {
      return res.status(400).json({ message: "lunch must be a boolean value" });
    }
    if (dinner !== undefined && typeof dinner !== 'boolean') {
      return res.status(400).json({ message: "dinner must be a boolean value" });
    }

    // Use current date if not provided
    let attendanceDate;
    if (date) {
      attendanceDate = new Date(date);
      if (isNaN(attendanceDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
    } else {
      // Set to today's date at midnight
      attendanceDate = new Date();
      attendanceDate.setHours(0, 0, 0, 0);
    }

    // Check if attendance for this date already exists
    let messAttendance = await MessAttendence.findOne({ 
      user: user._id, 
      date: attendanceDate 
    });

    const currentTime = new Date();

    if (messAttendance) {
      // Update only the provided meal fields
      if (breakfast !== undefined) {
        messAttendance.attendence.breakfast.attended = breakfast;
        if (breakfast) {
          messAttendance.attendence.breakfast.markedAt = currentTime;
        }
      }
      if (lunch !== undefined) {
        messAttendance.attendence.lunch.attended = lunch;
        if (lunch) {
          messAttendance.attendence.lunch.markedAt = currentTime;
        }
      }
      if (dinner !== undefined) {
        messAttendance.attendence.dinner.attended = dinner;
        if (dinner) {
          messAttendance.attendence.dinner.markedAt = currentTime;
        }
      }
      await messAttendance.save();

      return res.status(200).json({
        message: `Mess attendance updated for roll number ${roll} on ${attendanceDate.toDateString()}`,
        attendance: messAttendance,
      });
    } else {
      // Create new attendance record with provided meals, default others to false
      messAttendance = new MessAttendence({
        user: user._id,
        date: attendanceDate,
        attendence: {
          breakfast: {
            attended: breakfast !== undefined ? breakfast : false,
            markedAt: breakfast ? currentTime : undefined,
          },
          lunch: {
            attended: lunch !== undefined ? lunch : false,
            markedAt: lunch ? currentTime : undefined,
          },
          dinner: {
            attended: dinner !== undefined ? dinner : false,
            markedAt: dinner ? currentTime : undefined,
          },
        },
      });
      await messAttendance.save();

      return res.status(201).json({
        message: `Mess attendance marked for roll number ${roll} on ${attendanceDate.toDateString()}`,
        attendance: messAttendance,
      });
    }
  } catch (error) {
    console.error("Error in markMessAttendence:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const submitOutpassRequest = async (req, res) => {
  try {
    const userId = req.userId; // From verifyTokenFromCookies middleware
    
    const {
      fullName,
      email,
      rollNumber,
      semester,
      roomNumber,
      placeOfVisit,
      outDate,
      outTime,
      expectedReturnTime,
      studentContact,
      emergencyContact,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !rollNumber ||
      !semester ||
      !roomNumber ||
      !placeOfVisit ||
      !outDate ||
      !outTime ||
      !expectedReturnTime ||
      !studentContact ||
      !emergencyContact
    ) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }

    // Validate phone numbers (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(studentContact)) {
      return res.status(400).json({ 
        message: "Student contact number must be 10 digits" 
      });
    }
    if (!phoneRegex.test(emergencyContact)) {
      return res.status(400).json({ 
        message: "Emergency contact number must be 10 digits" 
      });
    }

    // Validate date is not in the past
    const selectedDate = new Date(outDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({ 
        message: "Out date cannot be in the past" 
      });
    }

    // Create new outpass request
    const outpass = new Outpass({
      user: userId,
      fullName,
      email,
      rollNumber: rollNumber.toUpperCase(),
      semester,
      roomNumber,
      placeOfVisit,
      outDate: selectedDate,
      outTime,
      expectedReturnTime,
      studentContact,
      emergencyContact,
      status: "pending",
    });

    await outpass.save();

    res.status(201).json({
      message: "Outpass request submitted successfully",
      outpass: {
        id: outpass._id,
        status: outpass.status,
        createdAt: outpass.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in submitOutpassRequest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyOutpasses = async (req, res) => {
  try {
    const userId = req.userId;

    const outpasses = await Outpass.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      message: "Outpass requests retrieved successfully",
      outpasses,
    });
  } catch (error) {
    console.error("Error in getMyOutpasses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOutpasses = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status;
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      query.outDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const outpasses = await Outpass.find(query)
      .populate("user", "name roll email")
      .populate("approvedBy", "name")
      .populate("rejectedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      message: "All outpass requests retrieved successfully",
      outpasses,
    });
  } catch (error) {
    console.error("Error in getAllOutpasses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOutpassStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const adminId = req.userId;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be 'approved' or 'rejected'" 
      });
    }

    const outpass = await Outpass.findById(id);

    if (!outpass) {
      return res.status(404).json({ message: "Outpass request not found" });
    }

    if (outpass.status !== "pending") {
      return res.status(400).json({ 
        message: `Outpass request is already ${outpass.status}` 
      });
    }

    outpass.status = status;
    outpass.remarks = remarks || "";

    if (status === "approved") {
      outpass.approvedBy = adminId;
      outpass.approvedAt = new Date();
    } else {
      outpass.rejectedBy = adminId;
      outpass.rejectedAt = new Date();
    }

    await outpass.save();

    res.status(200).json({
      message: `Outpass request ${status} successfully`,
      outpass,
    });
  } catch (error) {
    console.error("Error in updateOutpassStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};