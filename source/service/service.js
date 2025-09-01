
import CryptoJS from "crypto-js";
import { PrismaClient } from "@prisma/client";
import { SECRET_KEY, SECRET_KEY_REFRESH } from "../configuration/globalkey.js";
import { ErrorMessage, SuccessMessage } from "./message.js";
import jwt from "jsonwebtoken";


// เข้ารหัสข้อมูล (เช่น รหัสผ่าน) ก่อนบันทึกลงฐานข้อมูล
// 1. รับข้อมูลธรรมดา (เช่น รหัสผ่าน)
// 2. เข้ารหัสข้อมูลโดยใช้ AES และ SECRET_KEY
// 3. ส่งคืนข้อมูลที่ถูกเข้ารหัสเป็นสตริง
export const Encrypt = async (data) => {
  // console.log("SECRET_KEY in Encrypt:", SECRET_KEY); // For debugging only
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};


// ถอดรหัสข้อมูล (เช่น รหัสผ่าน) จากฐานข้อมูล
// 1. รับข้อมูลที่ถูกเข้ารหัส
// 2. ถอดรหัสโดยใช้ AES และ SECRET_KEY
// 3. ส่งคืนข้อมูลธรรมดาเดิม
export const Decrypt = async (data) => {
  return CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
};


// สร้าง JWT access และ refresh token
// 1. รับ userId
// 2. สร้าง payload สำหรับ access และ refresh token
// 3. สร้างลายเซ็น token ทั้งสองด้วย secret key และ วันหมดอายุที่กำหนด
// 4. ส่งคืนอ็อบเจกต์ที่มี { token, refreshToken }
export const GenerateToken = async (userId) => {
  return new Promise((resolve, reject) => {
    try {
      const payload = { id: userId };
      const payload_refresh = { id: userId };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "22h" });
      const refreshToken = jwt.sign(payload_refresh, SECRET_KEY_REFRESH, { expiresIn: "24h" });
      resolve({ token, refreshToken });
    } catch (error) {
      // console.log(error);
      reject(error);
    }
  });
};


// ตรวจสอบ access token
// 1. รับ JWT token
// 2. ตรวจสอบ token โดยใช้ SECRET_KEY
// 3. ถ้าถูกต้อง ค้นหาผู้ใช้ในฐานข้อมูลด้วย id ที่ถอดรหัสได้
// 4. ส่งคืนข้อมูลผู้ใช้ถ้าพบ มิฉะนั้นจะ reject
export const VerifyToken = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prisma = new PrismaClient();
      jwt.verify(token, SECRET_KEY, async (err, decode) => {
        if (err) return reject(err);
        const data = await prisma.user.findFirst({ where: { user_id: decode.id } });
        if (!data) return reject("Error Verify Token");
        return resolve(data);
      });
    } catch (error) {
      return reject(error);
    }
  });
};


// ตรวจสอบ refresh token และสร้าง token ใหม่
// 1. รับ refresh token
// 2. ตรวจสอบ token โดยใช้ SECRET_KEY_REFRESH
// 3. ถ้าถูกต้อง ค้นหาผู้ใช้ในฐานข้อมูลด้วย id ที่ถอดรหัสได้
// 4. ถ้าพบผู้ใช้ สร้าง access และ refresh token ใหม่
// 5. ส่งคืน token ใหม่ มิฉะนั้นจะ reject
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


// ค้นหาผู้ใช้ด้วยอีเมล
// 1. รับอีเมล
// 2. ค้นหาผู้ใช้ในฐานข้อมูลด้วยอีเมล
// 3. ส่งคืนข้อมูลผู้ใช้ถ้าพบ มิฉะนั้นจะ reject
export const FindOneUser = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prisma = new PrismaClient();
      const data = await prisma.user.findFirst({ where: { email } });
      if (!data) {
        reject(ErrorMessage.NotFound + "Password");
        return;
      }
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};


// ตรวจสอบว่ารหัสผ่านนี้มีอยู่ในฐานข้อมูลแล้วหรือไม่
// 1. รับรหัสผ่าน
// 2. ค้นหาผู้ใช้ในฐานข้อมูลด้วยรหัสผ่าน
// 3. ถ้าพบ จะ reject (รหัสผ่านนี้มีอยู่แล้ว)
// 4. ถ้าไม่พบ จะ resolve เป็น true
export const CheckPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prisma = new PrismaClient();
      const data = await prisma.user.findFirst({ where: { password } });
      if (data) {
        reject(SuccessMessage.Already);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};