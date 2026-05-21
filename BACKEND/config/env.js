import dotenv from "dotenv";
dotenv.config();

export const xsam = Object.freeze({
    env: Object.freeze({
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    GMAIL_SMTP_USER: process.env.GMAIL_SMTP_USER,
    GMAIL_SMTP_PASS: process.env.GMAIL_SMTP_PASS,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    SUPPORT_URL: process.env.SUPPORT_URL,
    }),
});

export default xsam;