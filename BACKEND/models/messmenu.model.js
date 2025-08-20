import mongoose from "mongoose";

const messmenuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    },
    breakfast: {
      type: String,
      required: true,
    },
    lunch: {
      type: String,
      required: true,
    },
    snacks: {
      type: String,
      required: true,
    },
    dinner: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MessMenu = mongoose.model("MessMenu", messmenuSchema);

export default MessMenu;
