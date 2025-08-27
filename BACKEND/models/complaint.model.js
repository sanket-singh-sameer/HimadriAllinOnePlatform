import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    serial: {
      type: Number,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
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
      enum: ["Pending", "Resolved", "Rejected"],
      default: "Pending",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate serial number
complaintSchema.pre('save', async function(next) {
  if (this.isNew && !this.serial) {
    try {
      const count = await mongoose.model('Complaint').countDocuments();
      this.serial = count + 1;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
