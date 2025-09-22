import { PrismaClient } from "@prisma/client";
import { deleteCloudinaryImage } from "../service/deleteCloudinaryImage.js";
import { ResponseMessages } from "../service/responseMessages.js";
import { SendSuccess, SendCreate, SendError } from "../service/response.js";
import { validateData } from "../service/validateData.js";
import { getLaosTime } from "../service/getLaosTime.js";
import { CheckPassword, Encrypt, FindOneUser, GenerateToken, Decrypt, VerifyRefreshToken } from "../service/userService.js";


export default class UserController {

  static async RefreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return SendError(res, 400, ResponseMessages.Error.BadRequest, "refreshToken");
      }
      const result = await VerifyRefreshToken(refreshToken);
      if (!result) return SendError(res, 404, ResponseMessages.Error.NotFound);
      return SendSuccess(res, ResponseMessages.Success.Update, result);
    } catch (error) {
      return SendError(res, 500, ResponseMessages.Error.ServerInternal, error);
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
        return SendError(res, 400, ResponseMessages.Error.BadRequest + validate.join(","));
      }
      const prisma = new PrismaClient();
      const existingEmail = await prisma.user.findFirst({ where: { email } });
      const existingPhone = await prisma.user.findFirst({ where: { phone: phone ? String(phone) : null } });
      let duplicateMsg = [];
      if (existingEmail) duplicateMsg.push('email');
      if (existingPhone) duplicateMsg.push('phone');
      if (duplicateMsg.length > 0) {
        return SendError(res, 400, 'Already exists: ' + duplicateMsg.join(', '));
      }
      const generatePassword = await Encrypt(password);
      if (!generatePassword) {
        return SendError(res, 400, ResponseMessages.Error.BadRequest);
      }
      await CheckPassword(password);
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
        return SendError(res, 404, ResponseMessages.Error.Insert);
      }
      user.password = undefined;
      return SendCreate(res, ResponseMessages.Success.Register, user);
    } catch (error) {
      return SendError(res, 500, ResponseMessages.Error.ServerInternal, error);
    }
  }

  static async Login(req, res) {
    try {
      const { password, email } = req.body;
      const validate = await validateData({ password, email });
      if (validate.length > 0) {
        return SendError(res, 400, `${ResponseMessages.Error.BadRequest}: ${validate.join(", ")}`);
      }
      const user = await FindOneUser(email);
      if (!user) {
        return SendError(res, 404, ResponseMessages.Error.EmailNotValid);
      }
      const decode = await Decrypt(user.password);
      if (password !== decode) {
        return SendError(res, 404, ResponseMessages.Error.PasswordsNotMatch);
      }
      user.password = undefined;
      const token = await GenerateToken(user.user_id);
      const data = Object.assign(
        JSON.parse(JSON.stringify(user)),
        JSON.parse(JSON.stringify(token))
      );
      return SendSuccess(res, ResponseMessages.Success.Login, data);
    } catch (error) {
      return SendError(res, 500, ResponseMessages.Error.ServerInternal, error);
    }
  }

  static async ForgotPassword(req, res) {
    try {
      const { newpassword, email } = req.body;
      const validate = await validateData({ email, newpassword });
      if (validate.length > 0) {
        console.log(validate);
        return SendError(res, 400, ResponseMessages.Error.BadRequest + validate.join(","));
      }
      const prisma = new PrismaClient();
      const checkUser = await prisma.user.findFirst({
        where: { email: email },
      });

      if (!checkUser) {
        return SendError(res, 404, ResponseMessages.Error.NotFound);
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
      return SendSuccess(res, ResponseMessages.Success.Update, data);
    } catch (error) {
      return SendError(res, 500, ResponseMessages.Error.ServerInternal, error);
    }
  }

  static async getAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const users = await prisma.user.findMany();
      if (users.length === 0) {
        return SendError(res, 404, ResponseMessages.Error.NotFound, "user");
      }
      return SendSuccess(res, ResponseMessages.Success.SelectAll, users);
    } catch (error) {
      console.log(error);
      return SendError(res, 500, ResponseMessages.Error.ServerInternal, error);
    }
  }

  static async getById(req, res) {
    try {
      const user_id = Number(req.params.user_id);
      if (isNaN(user_id)) {
        return SendError(res, 400, ResponseMessages.Error.BadRequest, "Invalid user_id");
      }
      const prisma = new PrismaClient();
      const user = await prisma.user.findFirst({ where: { user_id: user_id } });
      if (!user) {
        return SendError(res, 404, ResponseMessages.Error.NotFound, "user");
      }
      return SendSuccess(res, ResponseMessages.Success.SelectOne, user);
    } catch (error) {
      console.log(error);
      return SendError(res, 500, ResponseMessages.Error.ServerInternal, error);
    }
  }

  static async update(req, res) {
    try {
      const user_id = Number(req.params.user_id);
      if (isNaN(user_id)) {
        return SendError(res, 400, ResponseMessages.Error.BadRequest, "Invalid user_id");
      }
      if (!req.body) {
        return SendError(res, 400, ResponseMessages.Error.BadRequest, "No body data received");
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
      return SendSuccess(res, ResponseMessages.Success.Update, updatedUser);
    } catch (error) {
      console.log("error:", error);
      return SendError(res, 500, ResponseMessages.Error.ServerInternal, error);
    }
  }

  static async delete(req, res) {
    try {
      const user_id = Number(req.params.user_id);
      if (isNaN(user_id)) {
        return SendError(res, 400, ResponseMessages.Error.BadRequest, "Invalid user_id");
      }
      const prisma = new PrismaClient();
      const user = await prisma.user.findFirst({ where: { user_id: user_id } });
      if (!user) {
        return SendError(res, 404, ResponseMessages.Error.NotFound, "user");
      }
  await deleteCloudinaryImage(user.profile);
      const deletedUser = await prisma.user.delete({ where: { user_id: user_id } });
      return SendSuccess(res, ResponseMessages.Success.Delete, deletedUser);
    } catch (error) {
      return SendError(res, 500, ResponseMessages.Error.ServerInternal, error);
    }
  }
}