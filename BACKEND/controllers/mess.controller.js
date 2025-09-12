import Mess from "../models/mess.model.js";
import User from "../models/user.model.js";

export const getMySnacksPreference = async (req, res) => {
  try {
    const userId = req.user.id; 
    
    let mess = await Mess.findOne({ user: userId });
    if (!mess) {
      mess = new Mess({ user: userId, optedForSnacks: false });
      await mess.save();
    }
    
    res.status(200).json({
      message: "Your snacks preference retrieved successfully",
      optedForSnacks: mess.optedForSnacks,
    });
  } catch (error) {
    console.error("Error in getMySnacksPreference:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMySnacksPreference = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { optedForSnacks } = req.body;
    
    if (typeof optedForSnacks !== 'boolean') {
      return res.status(400).json({ 
        message: "optedForSnacks must be a boolean value" 
      });
    }
    
    // Find or create mess record for the user
    let mess = await Mess.findOne({ user: userId });
    if (!mess) {
      mess = new Mess({ user: userId, optedForSnacks });
    } else {
      mess.optedForSnacks = optedForSnacks;
    }
    
    await mess.save();
    
    const statusMessage = mess.optedForSnacks 
      ? "You have opted for snacks"
      : "You have opted out of snacks";
    
    res.status(200).json({
      message: statusMessage,
      optedForSnacks: mess.optedForSnacks,
    });
  } catch (error) {
    console.error("Error in updateMySnacksPreference:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkIfOptedForSnacks = async (req, res) => {
  let { roll } = req.params;
  try {
    roll = roll.toUpperCase()
    const userId = await User.findOne({ roll });
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Find or create mess record for the user
    let mess = await Mess.findOne({ user: userId._id });
    if (!mess) {
      mess = new Mess({ user: userId._id, optedForSnacks: false });
      await mess.save();
    }
    
    res.status(200).json({
      message: `Showing mess details for roll number ${roll}`,
      mess: mess,
      optedForSnacks: mess.optedForSnacks,
    });
  } catch (error) {
    console.error("Error in checkIfOptedForSnacks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addToSnacksList = async (req, res) => {
  let { roll } = req.params;
  try {
    roll = roll.toUpperCase()
    const userId = await User.findOne({ roll });
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Find or create mess record for the user
    let mess = await Mess.findOne({ user: userId._id });
    if (!mess) {
      mess = new Mess({ user: userId._id, optedForSnacks: true });
    } else {
      mess.optedForSnacks = true;
    }
    
    await mess.save();
    
    res.status(200).json({
      message: `Student with roll number ${roll} opted for snacks`,
      mess: mess,
      optedForSnacks: true,
    });
  } catch (error) {
    console.error("Error in addToSnacksList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromSnacksList = async (req, res) => {
  let { roll } = req.params;
  try {
    roll = roll.toUpperCase()
    const userId = await User.findOne({ roll });
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Find or create mess record for the user
    let mess = await Mess.findOne({ user: userId._id });
    if (!mess) {
      mess = new Mess({ user: userId._id, optedForSnacks: false });
    } else {
      mess.optedForSnacks = false;
    }
    
    await mess.save();
    
    res.status(200).json({
      message: `Student with roll number ${roll} opted out of snacks`,
      mess: mess,
      optedForSnacks: false,
    });
  } catch (error) {
    console.error("Error in removeFromSnacksList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOptedForSnacks = async (req, res) => {
  let { roll } = req.params;
  try {
    roll = roll.toUpperCase()
    const userId = await User.findOne({ roll });
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Find or create mess record for the user
    let mess = await Mess.findOne({ user: userId._id });
    if (!mess) {
      mess = new Mess({ user: userId._id, optedForSnacks: true });
    } else {
      mess.optedForSnacks = !mess.optedForSnacks;
    }
    
    await mess.save();
    
    const statusMessage = mess.optedForSnacks 
      ? `Student with roll number ${roll} opted for snacks`
      : `Student with roll number ${roll} opted out of snacks`;
    
    res.status(200).json({
      message: statusMessage,
      mess: mess,
      optedForSnacks: mess.optedForSnacks,
    });
  } catch (error) {
    console.error("Error in updateOptedForSnacks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
