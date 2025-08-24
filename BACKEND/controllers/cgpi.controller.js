import CGPI from "../models/cgpi.model.js";

export const viewCGPIByRoll = async (req, res) => {
  let { roll } = req.params;
  try {
    if (!roll) {
      return res.status(400).json({ message: "Roll number is required" });
    } else{
        roll = roll.toUpperCase();
    }
    const cgpiData = await CGPI.findOne({ roll });
    res.status(200).json(cgpiData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching CGPI data" });
  }
};
