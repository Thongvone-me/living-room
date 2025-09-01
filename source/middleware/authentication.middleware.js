
import { ErrorMessage } from "../service/message.js";
import { SendError } from "../service/response.js";
import { VerifyToken } from "../service/service.js";


// Middleware to authenticate user using JWT token
export const authentication = async (req, res, next) => {
  try {
    // 1. Get the Authorization header from the request
    const authorization = req.headers['authorization'];

    // 2. If no Authorization header, respond with 401 Unauthorized
    if (!authorization) { 
      return SendError(res, 401, ErrorMessage.Unauthorized);
    }

    // 3. Extract the token from the header (remove 'Bearer ' prefix)
    const token = authorization.replace("Bearer ", "");

    // 4. Verify the token using your service function
    const verify = await VerifyToken(token);

    // 5. If token is invalid, respond with 401 Unauthorized
    if (!verify) {
      return SendError(res, 401, ErrorMessage.Unauthorized);
    }

    // 6. Attach the decoded user info to the request object
    req.user = verify;

    // 7. (Optional) Log the decoded user for debugging (remove in production)
    // console.log('Decoded user from token:', req.user);

    // 8. Call next() to proceed to the next middleware or route handler
    next();
  } catch (error) {
    // 9. If any error occurs, respond with 500 Server Internal Error
    return SendError(res, 500, ErrorMessage.ServerInternal, error);
  }
};