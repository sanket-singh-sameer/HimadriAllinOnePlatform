import ImageKit from "imagekit";
import xsam from "../config/env.js";

const imagekit = new ImageKit({
  publicKey: xsam.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: xsam.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: xsam.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
