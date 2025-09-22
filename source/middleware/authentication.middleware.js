
import { ResponseMessages } from "../service/responseMessages.js";
import { SendError } from "../service/response.js";
import { VerifyToken } from "../service/userService.js";

export const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
  return SendError(res, 401, ResponseMessages.Error.Unauthorized);
    }
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    const user = await VerifyToken(token);
    if (!user) {
  return SendError(res, 401, ResponseMessages.Error.Unauthorized);
    }
    if (user.expired) {
      return SendError(res, 401, user.message);
    }
    req.user = user;
    next();
  } catch (error) {
  SendError(res, 500, ResponseMessages.Error.ServerInternal, error);
  }
};