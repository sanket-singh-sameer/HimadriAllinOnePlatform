import mongoose from "mongoose";

const cgpiSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  fName: {
    type: String,
  },
  cgpi: {
    type: Number,
  },
});

const CGPI = mongoose.model("CGPI", cgpiSchema);

export default CGPI;
