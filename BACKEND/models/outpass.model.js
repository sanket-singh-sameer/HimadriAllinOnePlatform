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
      enum: ["pending", "approved", "rejected", "expired"],
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

// Pre-save middleware to check and update expired status
outpassSchema.pre("save", function (next) {
  if (this.isNew) {
    // For new outpass requests, don't set expired on creation
    return next();
  }
  
  const now = new Date();
  
  // Check if pending request has expired (2 hours after creation)
  if (this.status === "pending") {
    const createdTime = this.createdAt;
    const twoHoursLater = new Date(createdTime.getTime() + 2 * 60 * 60 * 1000);
    
    if (now >= twoHoursLater) {
      this.status = "expired";
    }
  }
  
  // Check if approved request has expired (16 hours after approval)
  if (this.status === "approved" && this.approvedAt) {
    const approvedTime = this.approvedAt;
    const sixteenHoursLater = new Date(approvedTime.getTime() + 16 * 60 * 60 * 1000);
    
    if (now >= sixteenHoursLater) {
      this.status = "expired";
    }
  }
  
  next();
});

// Static method to check and update expired outpasses
outpassSchema.statics.updateExpiredOutpasses = async function () {
  const now = new Date();
  
  // Expire pending requests that are older than 2 hours
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  await this.updateMany(
    {
      status: "pending",
      createdAt: { $lte: twoHoursAgo },
    },
    {
      $set: { status: "expired" },
    }
  );
  
  // Expire approved requests that are older than 16 hours from approval time
  const sixteenHoursAgo = new Date(now.getTime() - 16 * 60 * 60 * 1000);
  await this.updateMany(
    {
      status: "approved",
      approvedAt: { $lte: sixteenHoursAgo },
    },
    {
      $set: { status: "expired" },
    }
  );
};

// Virtual to check if outpass is expired
outpassSchema.virtual("isExpired").get(function () {
  if (this.status === "expired") return true;
  
  const now = new Date();
  
  if (this.status === "pending") {
    const twoHoursLater = new Date(this.createdAt.getTime() + 2 * 60 * 60 * 1000);
    return now >= twoHoursLater;
  }
  
  if (this.status === "approved" && this.approvedAt) {
    const sixteenHoursLater = new Date(this.approvedAt.getTime() + 16 * 60 * 60 * 1000);
    return now >= sixteenHoursLater;
  }
  
  return false;
});

const Outpass = mongoose.model("Outpass", outpassSchema);

export default Outpass;
