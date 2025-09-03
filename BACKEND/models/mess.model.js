import mongoose from "mongoose";

const messSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  optedForSnacks: {
    type: Boolean,
    default: false,
  },
});

const Mess = mongoose.model("Mess", messSchema);

export default Mess;
