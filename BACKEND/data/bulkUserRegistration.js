import CGPI from "../models/cgpi.model.js";
import User from "../models/user.model.js";
import Password from "./model/password.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/connectDB.js";
dotenv.config();

connectDB();

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

export const bulkSignupController = async () => {
  try {
    let slno = 1;
    const allStudent = await CGPI.find({});

    for (const student of allStudent) {
      const name = student.name || "N/A";
      const fName = student.fName || "N/A";
      const roll = student.roll;
      const email = `${roll.toLowerCase()}@nith.ac.in`;
      const password = generateRandomPassword();
      const cgpi = student.cgpi;

      const existingUser = await User.findOne({ roll });

      if (existingUser) {
        existingUser.cgpi = cgpi;
        await existingUser.save();
        console.log(`${slno++} Updated CGPI for ${email} → ${cgpi}`);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
          await User.create({
            name,
            fName,
            email,
            password: hashedPassword,
            roll,
            cgpi, 
          });

          await Password.create({ email, password });

          console.log(
            `${slno++} Created user: ${email} with password: ${password}`
          );
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    }
  } catch (err) {
    console.error("Signup Controller Error:", err);
  }
};


bulkSignupController();