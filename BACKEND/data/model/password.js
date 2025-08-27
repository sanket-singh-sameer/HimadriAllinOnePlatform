import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const Password = mongoose.model("Password", passwordSchema);

export default Password;
