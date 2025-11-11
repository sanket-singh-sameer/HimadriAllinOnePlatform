import mongoose from "mongoose";

const messAttendenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  attendence: {
    breakfast: { 
      attended: { type: Boolean, default: false },
      markedAt: { type: Date }
    },
    lunch: { 
      attended: { type: Boolean, default: false },
      markedAt: { type: Date }
    },
    dinner: { 
      attended: { type: Boolean, default: false },
      markedAt: { type: Date }
    },
  },
}, { timestamps: true });

// Create compound index to ensure one record per user per day
messAttendenceSchema.index({ user: 1, date: 1 }, { unique: true });

const MessAttendence = mongoose.model("MessAttendence", messAttendenceSchema);

export default MessAttendence;
