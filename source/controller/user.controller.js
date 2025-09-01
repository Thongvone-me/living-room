import { PrismaClient } from "@prisma/client";
import { ErrorMessage, SuccessMessage } from "../service/message.js";
import { SendSuccess, SendCreate, SendError } from "../service/response.js";
import { validateData } from "../service/validate.js";
import { getLaosTime } from "../service/getLaosTime.js";
import {
  CheckPassword,
  Encrypt,
  FindOneUser,
  GenerateToken,
  Decrypt,
  VerifyRefreshToken
} from "../service/service.js";


export default class UserController {

  static async RefreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return SendError(res, 400, ErrorMessage.BadRequest, "refreshToken");
      }
      const result = await VerifyRefreshToken(refreshToken);
      if (!result) return SendError(res, 404, ErrorMessage.NotFound);
      return SendSuccess(res, SuccessMessage.Update, result);
    } catch (error) {
      return SendError(res, 500, ErrorMessage.ServerInternal, error);
    }
  }

  static async Register(req, res) {
    try {
      const {
        first_name,
        last_name,
        gender,
        role,
        password,
        email,
        phone,
        profile: profileFromBody
      } = req.body;
      const profile = req.file ? req.file.path : profileFromBody;
      const validate = await validateData({
        first_name,
        last_name,
        gender,
        role,
        password,
        email,
        phone,
        profile
      });
      if (validate.length > 0) {
        return SendError(res, 400, ErrorMessage.BadRequest + validate.join(","));
      }
      const generatePassword = await Encrypt(password);
      if (!generatePassword) {
        return SendError(res, 400, ErrorMessage.BadRequest);
      }
      await CheckPassword(password);
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      const user = await prisma.user.create({
        data: {
          first_name,
          last_name,
          gender,
          role,
          password: generatePassword,
          email,
          phone: phone ? String(phone) : null,
          profile,
          created_at: laosTime,
          updated_at: laosTime
        },
      });
      if (!user) {
        return SendError(res, 404, ErrorMessage.ErrorInsert);
      }
      user.password = undefined;
      return SendCreate(res, SuccessMessage.Register, user);
    } catch (error) {
      return SendError(res, 500, ErrorMessage.ServerInternal, error);
    }
  }

  static async Login(req, res) {
    try {
      const { password, email } = req.body;
      const validate = await validateData({ password, email });
      if (validate.length > 0) {
        return SendError(res, 400, `${ErrorMessage.BadRequest}: ${validate.join(", ")}`);
      }
      const user = await FindOneUser(email);
      if (!user) {
        return SendError(res, 404, ErrorMessage.NotFound);
      }
      const decode = await Decrypt(user.password);
      if (password !== decode) {
        return SendError(res, 404, ErrorMessage.IsNotMatch);
      }
      user.password = undefined;
      const token = await GenerateToken(user.user_id);
      const data = Object.assign(
        JSON.parse(JSON.stringify(user)),
        JSON.parse(JSON.stringify(token))
      );
      return SendSuccess(res, SuccessMessage.Login, data);
    } catch (error) {
      console.log(error);
      return SendError(res, 500, ErrorMessage.ServerInternal, error);
    }
  }

  static async ForgotPassword(req, res) {
    try {
      const { newpassword, email } = req.body;
      const validate = await validateData({ email, newpassword });
      if (validate.length > 0) {
        console.log(validate);
        return SendError(res, 400, ErrorMessage.BadRequest + validate.join(","));
      }
      const prisma = new PrismaClient();
      const checkUser = await prisma.user.findFirst({
        where: { email: email },
      });

      if (!checkUser) {
        return SendError(res, 404, ErrorMessage.NotFound);
      }

      const decryptPassword = await Encrypt(newpassword);
      const data = await prisma.user.update({
        where: {
          user_id: checkUser.user_id,
        },
        data: {
          password: decryptPassword,
        },
      });
      return SendSuccess(res, SuccessMessage.Update, data);
    } catch (error) {
      return SendError(res, 500, ErrorMessage.ServerInternal, error);
    }
  }

  static async getAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const users = await prisma.user.findMany();
      if (users.length === 0) {
        return SendError(res, 404, ErrorMessage.NotFound, "user");
      }
      return SendSuccess(res, SuccessMessage.SelectAll, users);
    } catch (error) {
      console.log(error);
      return SendError(res, 500, ErrorMessage.ServerInternal, error);
    }
  }

  static async getById(req, res) {
    try {
      const user_id = Number(req.params.user_id);
      if (isNaN(user_id)) {
        return SendError(res, 400, ErrorMessage.BadRequest, "Invalid user_id");
      }
      const prisma = new PrismaClient();
      const user = await prisma.user.findFirst({ where: { user_id: user_id } });
      if (!user) {
        return SendError(res, 404, ErrorMessage.NotFound, "user");
      }
      return SendSuccess(res, SuccessMessage.SelectOne, user);
    } catch (error) {
      console.log(error);
      return SendError(res, 500, ErrorMessage.ServerInternal, error);
    }
  }

  static async update(req, res) {
    try {
      const user_id = Number(req.params.user_id);
      if (isNaN(user_id)) {
        return SendError(res, 400, ErrorMessage.BadRequest, "Invalid user_id");
      }
      console.log("UPDATE HEADERS:", req.headers);
      if (!req.body) {
        console.log("UPDATE ERROR: req.body is undefined");
        return SendError(res, 400, ErrorMessage.BadRequest, "No body data received");
      }
      console.log("UPDATE BODY:", req.body);
      if (req.file) {
        console.log("UPDATE FILE:", req.file);
      }
      const {
        first_name,
        last_name,
        gender,
        role,
        email,
        phone,
        profile: profileFromBody
      } = req.body;
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      // Get current user to keep old profile if no new file is uploaded
      const currentUser = await prisma.user.findFirst({ where: { user_id } });
      const profile = req.file ? req.file.path : (profileFromBody || (currentUser && currentUser.profile));
      const updatedUser = await prisma.user.update({
        where: { user_id },
        data: {
          first_name,
          last_name,
          gender,
          role,
          email,
          phone,
          profile,
          updated_at: laosTime
        }
      });
      return SendSuccess(res, SuccessMessage.Update, updatedUser);
    } catch (error) {
      console.log("UPDATE ERROR:", error, error?.message, error?.stack);
      return SendError(res, 500, ErrorMessage.ServerInternal, error);
    }
  }

  static async delete(req, res) {
    try {
      const user_id = Number(req.params.user_id);
      if (isNaN(user_id)) {
        return SendError(res, 400, ErrorMessage.BadRequest, "Invalid user_id");
      }
      const prisma = new PrismaClient();
      const user = await prisma.user.findFirst({ where: { user_id: user_id } });
      if (!user) {
        return SendError(res, 404, ErrorMessage.NotFound, "user");
      }
      const deletedUser = await prisma.user.delete({ where: { user_id: user_id } });
      return SendSuccess(res, SuccessMessage.Delete, deletedUser);
    } catch (error) {
      return SendError(res, 500, ErrorMessage.ServerInternal, error);
    }
  }
}