
import { PrismaClient } from "@prisma/client";
import { SendSuccess, SendCreate, SendError } from "../service/response.js";
import { validateData } from "../service/validate.js";
import { getLaosTime } from "../service/getLaosTime.js";

export default class RoomTypeController {

  static async create(req, res) {
    try {
      const { name, description } = req.body;
      const validate = await validateData({ name });
      if (validate.length > 0) {
        return SendError(res, 400, "BadRequest: " + validate.join(", "));
      }
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      const roomType = await prisma.roomType.create({
        data: {
           name,
           description,
           created_at: laosTime,
           updated_at: laosTime
        },
      });
      return SendCreate(res, "RoomType created successfully", roomType);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const roomTypes = await prisma.roomType.findMany();
      return SendSuccess(res, "All room types fetched", roomTypes);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getById(req, res) {
    try {
      const roomtype_id = Number(req.params.roomtype_id);
      if (isNaN(roomtype_id)) {
        return SendError(res, 400, "BadRequest: Invalid roomtype_id");
      }
      const prisma = new PrismaClient();
      const roomType = await prisma.roomType.findFirst({ where: { roomtype_id } });
      if (!roomType) {
        return SendError(res, 404, "NotFound: room type");
      }
      return SendSuccess(res, "RoomType fetched", roomType);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async updateById(req, res) {
    try {
      const roomtype_id = Number(req.params.roomtype_id);
      if (isNaN(roomtype_id)) {
        return SendError(res, 400, "BadRequest: Invalid roomtype_id");
      }
      const { name, description } = req.body;
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      const updatedRoomType = await prisma.roomType.update({
        where: { roomtype_id },
        data: { 
          name,
          description,
          updated_at: laosTime
          },
      });
      return SendSuccess(res, "RoomType updated", updatedRoomType);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async delete(req, res) {
    try {
      const roomtype_id = Number(req.params.roomtype_id);
      if (isNaN(roomtype_id)) {
        return SendError(res, 400, "BadRequest: Invalid roomtype_id");
      }
      const prisma = new PrismaClient();
      const deletedRoomType = await prisma.roomType.delete({ where: { roomtype_id } });
      return SendSuccess(res, "RoomType deleted", deletedRoomType);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }
}
