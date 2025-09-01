
import { PrismaClient } from "@prisma/client";
import { SendSuccess, SendCreate, SendError } from "../service/response.js";
import { validateData } from "../service/validate.js";
import { getLaosTime } from "../service/getLaosTime.js";

export default class RoomController {

  static async create(req, res) {
    try {
      const { room_number, floor, roomtype_id, status } = req.body;
      const validate = await validateData({ room_number, floor, roomtype_id, status });
      if (validate.length > 0) {
        return SendError(res, 400, "BadRequest: " + validate.join(", "));
      }
      const prisma = new PrismaClient();
      const laoTime = getLaosTime();
      const room = await prisma.room.create({
        data: { 
          room_number,
          floor,
          roomtype_id,
          status,
          created_at: laoTime,
          updated_at: laoTime
        },
      });
      return SendCreate(res, "Room created successfully", room);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const rooms = await prisma.room.findMany();
      return SendSuccess(res, "All rooms fetched", rooms);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getById(req, res) {
    try {
      const room_id = Number(req.params.room_id);
      if (isNaN(room_id)) {
        return SendError(res, 400, "BadRequest: Invalid room_id");
      }
      const prisma = new PrismaClient();
      const room = await prisma.room.findFirst({ where: { room_id } });
      if (!room) {
        return SendError(res, 404, "NotFound: room");
      }
      return SendSuccess(res, "Room fetched", room);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getOnlyStatus(req, res) {
    try {
      const room_id = Number(req.params.room_id);
      if (isNaN(room_id)) {
        return SendError(res, 400, "BadRequest: Invalid room_id");
      }
      const prisma = new PrismaClient();
      const room = await prisma.room.findFirst({
        where: { room_id },
        select: { status: true }
      });
      if (!room) {
        return SendError(res, 404, "NotFound: room");
      }
      return SendSuccess(res, "Room status fetched", room);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async updateById(req, res) {
    try {
      const room_id = Number(req.params.room_id);
      if (isNaN(room_id)) {
        return SendError(res, 400, "BadRequest: Invalid room_id");
      }
      const { room_number, floor, roomtype_id, status } = req.body;
      const prisma = new PrismaClient();
      const laoTime = getLaosTime();
      const updatedRoom = await prisma.room.update({
        where: { room_id },
        data: { 
          room_number,
          floor,
          roomtype_id,
          status,
          updated_at: laoTime
        },
      });
      return SendSuccess(res, "Room updated", updatedRoom);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }


  static async delete(req, res) {
    try {
      const room_id = Number(req.params.room_id);
      if (isNaN(room_id)) {
        return SendError(res, 400, "BadRequest: Invalid room_id");
      }
      const prisma = new PrismaClient();
      const deletedRoom = await prisma.room.delete({ where: { room_id } });
      return SendSuccess(res, "Room deleted", deletedRoom);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }
}
