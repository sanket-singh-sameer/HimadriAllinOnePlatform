import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date:{
      type: String
    },
    name: {
      type: String,
    },
    room: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Under-Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
