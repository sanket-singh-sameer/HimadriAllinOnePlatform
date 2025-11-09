import mongoose from "mongoose";

const outpassSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    placeOfVisit: {
      type: String,
      required: true,
    },
    outDate: {
      type: Date,
      required: true,
    },
    outTime: {
      type: String,
      required: true,
    },
    expectedReturnTime: {
      type: String,
      required: true,
    },
    studentContact: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: {
      type: Date,
    },
    remarks: {
      type: String,
    },
    actualOutTime: {
      type: Date,
    },
    actualInTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Outpass = mongoose.model("Outpass", outpassSchema);

export default Outpass;
