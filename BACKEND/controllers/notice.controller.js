import Notice from "../models/notice.model.js";
import User from "../models/user.model.js";

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
    const getAuthorNameById = async (authorId) => {
      const user = await User.findById(authorId);
      return user ? user.name : "Unknown";
    };
    const notices = await Notice.find();
    res
      .status(200)
      .json({
        message: "Notices retrieved successfully",
        notices: await Promise.all(
          notices.reverse().map(async (notice) => ({
            ...notice._doc,
            author: await getAuthorNameById(notice.author),
          }))
        ),
      });
  } catch (error) {
    console.error("Error retrieving notices:", error);
    res.status(500).json({ message: "Error retrieving notices" });
  }
};

export const deleteNotice = async (req, res) => {
  const { noticeId } = req.params;
  const author = req.userId;
  try {
    const notice = await Notice.findById(noticeId);
    const authorUser = await User.findById(author);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    if (authorUser.role !== 'admin' && notice.author.toString() !== author) {
      return res.status(403).json({ message: "You don't have permission to delete this notice" });
    }
    await Notice.findByIdAndDelete(noticeId);
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ message: "Error deleting notice" });
  }
};
