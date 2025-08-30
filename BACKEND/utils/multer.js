import multer from "multer";
import imagekit from "./imagekit.js";


const storage = multer.memoryStorage();
const upload = multer({ storage });