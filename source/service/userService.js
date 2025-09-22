
import CryptoJS from "crypto-js";
import { PrismaClient } from "@prisma/client";
import { SECRET_KEY, SECRET_KEY_REFRESH } from "../configuration/globalkeys.js";
import { ResponseMessages } from "./responseMessages.js";
import jwt from "jsonwebtoken";


export const Encrypt = async (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};
export const Decrypt = async (data) => {
  return CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
};
export const GenerateToken = async (userId) => {
  return new Promise((resolve, reject) => {
    try {
      const payload = { id: userId };
      const payload_refresh = { id: userId };
      const expiresIn = process.env.JWT_EXPIRES_IN;
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn });
      const refreshToken = jwt.sign(payload_refresh, SECRET_KEY_REFRESH, { expiresIn });
      resolve({ token, refreshToken });
    } catch (error) {
      reject(error);
    }
  });
};
export const VerifyToken = async (token) => {
  return new Promise(async (resolve) => {
    try {
      const prisma = new PrismaClient();
      jwt.verify(token, SECRET_KEY, async (err, decode) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return resolve({ expired: true, message: 'Token has expired. Please log in again.' });
          }
          return resolve(null);
        }
        const data = await prisma.user.findFirst({ where: { user_id: decode.id } });
        if (!data) return resolve(null);
        return resolve(data);
      });
    } catch (error) {
      return resolve(null);
    }
  });
};
export const VerifyRefreshToken = async (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prisma = new PrismaClient();
      jwt.verify(refreshToken, SECRET_KEY_REFRESH, async (err, decode) => {
        if (err) return reject(err);
        const data = await prisma.user.findFirst({ where: { user_id: decode.id } });
        if (!data) return reject("Error Verify Token");
        const token = await GenerateToken(data.user_id);
        if (!token) return reject("Error Generate RefreshToken");
        return resolve(token);
      });
    } catch (error) {
      return reject(error);
    }
  });
};
export const FindOneUser = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prisma = new PrismaClient();
      const data = await prisma.user.findFirst({ where: { email } });
      if (!data) {
        resolve(null);
        return;
      }
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
export const CheckPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prisma = new PrismaClient();
      const data = await prisma.user.findFirst({ where: { password } });
      if (data) {
    reject(ResponseMessages.Success.AlreadyExists);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};