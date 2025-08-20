import Notice from "../models/notice.model.js";

export const createNotice = async (req, res) => {
  const { title, description } = req.body;

  try {
    const author = req.userId;
    const newNotice = new Notice({ title, description, author });
    await newNotice.save();
    res
      .status(201)
      .json({ message: "Notice created successfully", notice: newNotice });
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({ message: "Error Creating new Notice" });
  }
};


export const viewAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find();
    res.status(200).json({ message: "Notices retrieved successfully", notices });
  } catch (error) {
    console.error("Error retrieving notices:", error);
    res.status(500).json({ message: "Error retrieving notices" });
  }
};
