import { verify } from "crypto";
import Complaint from "../models/complaint.model.js";
import { getCookies } from "../utils/cookieOperations.js";
import { verifyToken } from "../utils/jwtTokenOperations.js";
import { getUserId } from "../utils/getUserId.js";

export const createComplaint = async (req, res) => {
  try {
    const user = getUserId(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { room, title, description, photo, category } = req.body;
    if (!room || !title || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newComplaint = new Complaint({
      user,
      room,
      title,
      description,
      photo,
      category,
    });

    await newComplaint.save();
    res
      .status(201)
      .json({
        message: "Complaint created successfully",
        complaint: newComplaint,
      });
  } catch (error) {
    res.status(500).json({ message: "Error creating complaint", error });
  }
};

export const viewComplaint = async (req, res) => {
  try {
    const user = getUserId(req);
    const complaints = await Complaint.find({ user });
    res
      .status(200)
      .json({ message: "Complaints retrieved successfully", complaints });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving complaints", error });
  }
};


export const viewComplaintDetails = async (req, res) => {
  try {
    const user = getUserId(req);
    const { id } = req.params;
    const complaint = await Complaint.findOne({ _id: id, user });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found or you are not authorized to view it." });
    }
    res
      .status(200)
      .json({ message: "Complaint retrieved successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving complaint", error });
  }
};