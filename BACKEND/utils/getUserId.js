import { getCookies } from "./cookieOperations.js";
import { verifyToken } from "./jwtTokenOperations.js";

export const getUserId = (req) => {

  const token = getCookies(req);
  const decoded = verifyToken(token);
  const user = decoded ? decoded.id : null;

  return user;
};
