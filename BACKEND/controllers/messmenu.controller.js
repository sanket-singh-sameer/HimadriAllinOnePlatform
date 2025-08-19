import MessMenu from "../models/messmenu.model.js";


export const addMenu = async (req, res) => {
  const { day, breakfast, lunch, snacks, dinner } = req.body;

  try {
    if (!day || !breakfast || !lunch || !snacks || !dinner) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newMenu = new MessMenu({
      day: day.toLowerCase(),
      breakfast,
      lunch,
      snacks,
      dinner,
    });
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ message: "Error adding menu", error });
  }
};


export const fetchTodaysMenu = async (req, res) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

  try {
    const menu = await MessMenu.findOne({ day: today });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found for today" });
    }
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's menu", error });
  }
};