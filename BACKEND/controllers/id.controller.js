import User from "../models/user.model.js";
import MessAttendence from "../models/messattendence.model.js";
import Outpass from "../models/outpass.model.js";
import ExcelJS from "exceljs";

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
  const { date } = req.body;
  
  try {
    roll = roll.toUpperCase();
    const user = await User.findOne({ roll });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use current date if not provided
    let attendanceDate;
    if (date) {
      attendanceDate = new Date(date);
      if (isNaN(attendanceDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      // Normalize to midnight
      attendanceDate.setHours(0, 0, 0, 0);
    } else {
      // Set to today's date at midnight
      attendanceDate = new Date();
      attendanceDate.setHours(0, 0, 0, 0);
    }

    // Determine which meal to mark based on current time
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    let attendance = {
      breakfast: false,
      lunch: false,
      dinner: false
    };
    
    let mealType = "";
    
    // 6 AM to 10 AM - Breakfast
    if (currentHour >= 6 && currentHour < 10) {
      attendance.breakfast = true;
      mealType = "breakfast";
    }
    // 11 AM to 3 PM (15:00) - Lunch
    else if (currentHour >= 11 && currentHour < 15) {
      attendance.lunch = true;
      mealType = "lunch";
    }
    // 6 PM (18:00) to 10 PM (22:00) - Dinner
    else if (currentHour >= 18 && currentHour < 22) {
      attendance.dinner = true;
      mealType = "dinner";
    }
    else {
      return res.status(400).json({ 
        message: "Mess attendance can only be marked during meal times: Breakfast (6 AM - 10 AM), Lunch (11 AM - 3 PM), or Dinner (6 PM - 10 PM)" 
      });
    }

    // Check if attendance for this date already exists
    // Use date range to ensure we get the record for the exact day
    const startOfDay = new Date(attendanceDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    let messAttendance = await MessAttendence.findOne({ 
      user: user._id, 
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (messAttendance) {
      // Check if this specific meal is already marked
      let alreadyMarked = false;
      let alreadyMarkedMessage = "";

      if (attendance.breakfast && messAttendance.attendence.breakfast.attended) {
        alreadyMarked = true;
        alreadyMarkedMessage = "Breakfast attendance was already marked earlier today";
      }
      if (attendance.lunch && messAttendance.attendence.lunch.attended) {
        alreadyMarked = true;
        alreadyMarkedMessage = "Lunch attendance was already marked earlier today";
      }
      if (attendance.dinner && messAttendance.attendence.dinner.attended) {
        alreadyMarked = true;
        alreadyMarkedMessage = "Dinner attendance was already marked earlier today";
      }

      if (alreadyMarked) {
        return res.status(200).json({
          message: alreadyMarkedMessage,
          attendance: messAttendance,
          markedMeal: mealType,
          alreadyMarked: true
        });
      }

      // Update only the meal for current time slot if not already marked
      if (attendance.breakfast) {
        messAttendance.attendence.breakfast.attended = true;
        messAttendance.attendence.breakfast.markedAt = currentTime;
      }
      if (attendance.lunch) {
        messAttendance.attendence.lunch.attended = true;
        messAttendance.attendence.lunch.markedAt = currentTime;
      }
      if (attendance.dinner) {
        messAttendance.attendence.dinner.attended = true;
        messAttendance.attendence.dinner.markedAt = currentTime;
      }
      await messAttendance.save();

      return res.status(200).json({
        message: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} attendance marked for ${roll} on ${attendanceDate.toDateString()}`,
        attendance: messAttendance,
        markedMeal: mealType,
        alreadyMarked: false
      });
    } else {
      // Create new attendance record with the appropriate meal marked
      messAttendance = new MessAttendence({
        user: user._id,
        date: attendanceDate,
        attendence: {
          breakfast: {
            attended: attendance.breakfast,
            markedAt: attendance.breakfast ? currentTime : undefined,
          },
          lunch: {
            attended: attendance.lunch,
            markedAt: attendance.lunch ? currentTime : undefined,
          },
          dinner: {
            attended: attendance.dinner,
            markedAt: attendance.dinner ? currentTime : undefined,
          },
        },
      });
      await messAttendance.save();

      return res.status(201).json({
        message: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} attendance marked for ${roll} on ${attendanceDate.toDateString()}`,
        attendance: messAttendance,
        markedMeal: mealType,
        alreadyMarked: false
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

    // Check if student already has a pending or approved outpass
    // const existingOutpass = await Outpass.findOne({
    //   user: userId,
    //   status: { $in: ["pending", "approved"] }
    // });

    // if (existingOutpass) {
    //   return res.status(400).json({ 
    //     message: `You already have a ${existingOutpass.status} outpass. Please wait for it to be processed or expired before applying for a new one.`,
    //     existingOutpass: {
    //       id: existingOutpass._id,
    //       status: existingOutpass.status,
    //       outDate: existingOutpass.outDate,
    //       placeOfVisit: existingOutpass.placeOfVisit,
    //       createdAt: existingOutpass.createdAt
    //     }
    //   });
    // }

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

    // Update expired outpasses before fetching
    await Outpass.updateExpiredOutpasses();

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

    // Update expired outpasses before fetching
    await Outpass.updateExpiredOutpasses();

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

    // Check if outpass is expired
    const now = new Date();
    if (outpass.status === "pending") {
      const twoHoursLater = new Date(outpass.createdAt.getTime() + 2 * 60 * 60 * 1000);
      if (now >= twoHoursLater) {
        outpass.status = "expired";
        await outpass.save();
        return res.status(400).json({ 
          message: "This outpass request has expired (more than 2 hours old)" 
        });
      }
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

export const exportMessAttendance = async (req, res) => {
  try {
    const { startDate, endDate, roll } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: "Start date and end date are required" 
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (start > end) {
      return res.status(400).json({ 
        message: "Start date cannot be after end date" 
      });
    }

    // Build query for attendance records
    let query = {
      date: {
        $gte: start,
        $lte: end,
      },
    };

    // If roll number is provided, filter by specific student
    if (roll) {
      const student = await User.findOne({ roll: roll.toUpperCase() });
      if (!student) {
        return res.status(404).json({ 
          message: `Student with roll number ${roll} not found` 
        });
      }
      query.user = student._id;
    }

    // Fetch attendance records
    const attendanceRecords = await MessAttendence.find(query)
      .populate("user", "name roll email room phone")
      .sort({ date: 1, "user.roll": 1 })
      .lean();

    if (attendanceRecords.length === 0) {
      const message = roll 
        ? `No attendance records found for student ${roll} in the selected date range`
        : "No attendance records found for the selected date range";
      return res.status(404).json({ message });
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const sheetName = roll ? `Attendance - ${roll}` : "Mess Attendance - All Students";
    const worksheet = workbook.addWorksheet(sheetName);

    // Set up columns
    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Roll Number", key: "roll", width: 15 },
      { header: "Name", key: "name", width: 25 },
      { header: "Room", key: "room", width: 10 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Breakfast", key: "breakfast", width: 12 },
      { header: "Breakfast Time", key: "breakfastTime", width: 18 },
      { header: "Lunch", key: "lunch", width: 12 },
      { header: "Lunch Time", key: "lunchTime", width: 18 },
      { header: "Dinner", key: "dinner", width: 12 },
      { header: "Dinner Time", key: "dinnerTime", width: 18 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" }, // Gray-900
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getRow(1).height = 25;

    // Add data rows
    attendanceRecords.forEach((record) => {
      const row = {
        date: new Date(record.date).toLocaleDateString("en-GB"),
        roll: record.user?.roll || "N/A",
        name: record.user?.name || "N/A",
        room: record.user?.room || "N/A",
        email: record.user?.email || "N/A",
        phone: record.user?.phone || "N/A",
        breakfast: record.attendence?.breakfast?.attended ? "✓" : "✗",
        breakfastTime: record.attendence?.breakfast?.markedAt 
          ? new Date(record.attendence.breakfast.markedAt).toLocaleTimeString("en-GB")
          : "-",
        lunch: record.attendence?.lunch?.attended ? "✓" : "✗",
        lunchTime: record.attendence?.lunch?.markedAt 
          ? new Date(record.attendence.lunch.markedAt).toLocaleTimeString("en-GB")
          : "-",
        dinner: record.attendence?.dinner?.attended ? "✓" : "✗",
        dinnerTime: record.attendence?.dinner?.markedAt 
          ? new Date(record.attendence.dinner.markedAt).toLocaleTimeString("en-GB")
          : "-",
      };
      
      const addedRow = worksheet.addRow(row);
      
      // Style attendance columns with colors
      if (record.attendence?.breakfast?.attended) {
        addedRow.getCell("breakfast").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD1FAE5" }, // Green-100
        };
        addedRow.getCell("breakfast").font = { color: { argb: "FF065F46" } }; // Green-800
      } else {
        addedRow.getCell("breakfast").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEE2E2" }, // Red-100
        };
        addedRow.getCell("breakfast").font = { color: { argb: "FF991B1B" } }; // Red-800
      }

      if (record.attendence?.lunch?.attended) {
        addedRow.getCell("lunch").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD1FAE5" },
        };
        addedRow.getCell("lunch").font = { color: { argb: "FF065F46" } };
      } else {
        addedRow.getCell("lunch").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEE2E2" },
        };
        addedRow.getCell("lunch").font = { color: { argb: "FF991B1B" } };
      }

      if (record.attendence?.dinner?.attended) {
        addedRow.getCell("dinner").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD1FAE5" },
        };
        addedRow.getCell("dinner").font = { color: { argb: "FF065F46" } };
      } else {
        addedRow.getCell("dinner").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEE2E2" },
        };
        addedRow.getCell("dinner").font = { color: { argb: "FF991B1B" } };
      }

      // Center align attendance marks
      addedRow.getCell("breakfast").alignment = { horizontal: "center", vertical: "middle" };
      addedRow.getCell("lunch").alignment = { horizontal: "center", vertical: "middle" };
      addedRow.getCell("dinner").alignment = { horizontal: "center", vertical: "middle" };
    });

    // Add borders to all cells
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFD1D5DB" } },
          left: { style: "thin", color: { argb: "FFD1D5DB" } },
          bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
          right: { style: "thin", color: { argb: "FFD1D5DB" } },
        };
      });
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers for file download
    const filename = roll 
      ? `mess_attendance_${roll}_${startDate}_to_${endDate}.xlsx`
      : `mess_attendance_all_students_${startDate}_to_${endDate}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}`
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error in exportMessAttendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cleanup duplicate attendance records (admin utility)
export const cleanupDuplicateAttendance = async (req, res) => {
  try {
    console.log("Starting cleanup of duplicate attendance records...");
    
    // Find all attendance records
    const allRecords = await MessAttendence.find({}).sort({ user: 1, date: 1, createdAt: 1 });
    
    const seen = new Map(); // Map to track user+date combinations
    const duplicates = [];
    
    for (const record of allRecords) {
      const key = `${record.user}_${record.date.toISOString().split('T')[0]}`;
      
      if (seen.has(key)) {
        // This is a duplicate - merge data and delete
        const original = seen.get(key);
        
        // Merge attendance data (keep any marked meals)
        if (record.attendence.breakfast.attended && !original.attendence.breakfast.attended) {
          original.attendence.breakfast = record.attendence.breakfast;
        }
        if (record.attendence.lunch.attended && !original.attendence.lunch.attended) {
          original.attendence.lunch = record.attendence.lunch;
        }
        if (record.attendence.dinner.attended && !original.attendence.dinner.attended) {
          original.attendence.dinner = record.attendence.dinner;
        }
        
        await original.save();
        await MessAttendence.findByIdAndDelete(record._id);
        duplicates.push(record._id);
        
        console.log(`Merged and deleted duplicate: ${key}`);
      } else {
        seen.set(key, record);
      }
    }
    
    console.log(`Cleanup complete. Removed ${duplicates.length} duplicate records.`);
    
    res.status(200).json({
      message: "Duplicate cleanup completed",
      duplicatesRemoved: duplicates.length,
      duplicateIds: duplicates
    });
  } catch (error) {
    console.error("Error in cleanupDuplicateAttendance:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Guard outpass verification and gate entry/exit
export const guardOutpassVerification = async (req, res) => {
  let { roll } = req.params;
  
  try {
    roll = roll.toUpperCase();
    
    // Find user
    const user = await User.findOne({ roll });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Student not found with this roll number" 
      });
    }

    // Find the latest approved outpass for this user
    const latestOutpass = await Outpass.findOne({ 
      rollNumber: roll,
      status: "approved"
    })
    .sort({ approvedAt: -1 }) // Get most recent approved outpass
    .populate('user', 'name roll email phone room');

    if (!latestOutpass) {
      return res.status(404).json({ 
        success: false,
        message: "No approved outpass found for this student",
        user: {
          name: user.name,
          roll: user.roll,
          room: user.room
        }
      });
    }

    const now = new Date();
    
    // Check if outDate matches current date
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const outpassDate = new Date(latestOutpass.outDate.getFullYear(), latestOutpass.outDate.getMonth(), latestOutpass.outDate.getDate());
    
    if (currentDate.getTime() !== outpassDate.getTime()) {
      return res.status(400).json({ 
        success: false,
        message: `Outpass is valid for ${latestOutpass.outDate.toLocaleDateString()}, not for today`,
        outpass: {
          outDate: latestOutpass.outDate,
          placeOfVisit: latestOutpass.placeOfVisit,
          status: latestOutpass.status
        }
      });
    }
    
    // Check if outpass has expired
    if (latestOutpass.approvedAt) {
      const sixteenHoursLater = new Date(latestOutpass.approvedAt.getTime() + 16 * 60 * 60 * 1000);
      if (now >= sixteenHoursLater) {
        latestOutpass.status = "expired";
        await latestOutpass.save();
        
        return res.status(400).json({ 
          success: false,
          message: "Outpass has expired",
          outpass: latestOutpass
        });
      }
    }

    // Determine if this is OUT or IN
    let action = "";
    let updatedOutpass;

    if (!latestOutpass.actualOutTime) {
      // First scan - Student is going OUT
      latestOutpass.actualOutTime = now;
      await latestOutpass.save();
      action = "OUT";
      
      return res.status(200).json({
        success: true,
        action: "OUT",
        message: `Exit recorded for ${user.name}`,
        outpass: latestOutpass,
        user: {
          name: user.name,
          roll: user.roll,
          room: user.room,
          phone: user.phone
        },
        timestamp: now
      });
    } 
    else if (!latestOutpass.actualInTime) {
      // Second scan - Student is coming IN
      latestOutpass.actualInTime = now;
      await latestOutpass.save();
      action = "IN";

      // Calculate duration
      const duration = Math.round((now - latestOutpass.actualOutTime) / (1000 * 60)); // in minutes
      
      return res.status(200).json({
        success: true,
        action: "IN",
        message: `Entry recorded for ${user.name}`,
        outpass: latestOutpass,
        user: {
          name: user.name,
          roll: user.roll,
          room: user.room,
          phone: user.phone
        },
        timestamp: now,
        outTime: latestOutpass.actualOutTime,
        duration: `${Math.floor(duration / 60)}h ${duration % 60}m`
      });
    } 
    else {
      // Both times are already set - outpass is complete
      return res.status(400).json({
        success: false,
        message: "This outpass has already been used (both OUT and IN recorded)",
        outpass: latestOutpass,
        user: {
          name: user.name,
          roll: user.roll,
          room: user.room
        }
      });
    }

  } catch (error) {
    console.error("Error in guardOutpassVerification:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error", 
      error: error.message 
    });
  }
};