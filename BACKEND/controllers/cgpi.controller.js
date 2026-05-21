import CGPI from "../models/cgpi.model.js";
import { redisGetJson, redisSetJson } from "../utils/redisCache.js";

export const viewCGPIByRoll = async (req, res) => {
  let { roll } = req.params;
  try {
    if (!roll) {
      return res.status(400).json({ message: "Roll number is required" });
    } else{
        roll = roll.toUpperCase();
    }
    const cacheKey = `cgpi:roll:${roll}`;
    const cachedCgpi = await redisGetJson(cacheKey);
    if (cachedCgpi) {
      return res.status(200).json(cachedCgpi);
    }
    const cgpiData = await CGPI.findOne({ roll });
    await redisSetJson(cacheKey, cgpiData, 3600);
    res.status(200).json(cgpiData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching CGPI data" });
  }
};
