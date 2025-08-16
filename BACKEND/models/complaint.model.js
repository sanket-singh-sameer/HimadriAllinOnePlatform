import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: "String",
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
      enum: [
        "mess-related",
        "water-supply",
        "bathroom",
        "electricity",
        "internet",
        "floor-related",
        "elevator-related",
        "furniture-related",
        "security-related",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "under-progress", "resolved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
