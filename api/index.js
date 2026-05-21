import app from "../BACKEND/server.js";

export default function handler(req, res) {
  return app(req, res);
}