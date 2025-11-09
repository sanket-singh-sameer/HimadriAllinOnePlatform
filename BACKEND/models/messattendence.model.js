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

const MessAttendence = mongoose.model("MessAttendence", messAttendenceSchema);

export default MessAttendence;
