
import { PrismaClient } from "@prisma/client";
import { SendSuccess, SendCreate, SendError } from "../service/response.js";
import { validateData } from "../service/validateData.js";
import { getLaosTime } from "../service/getLaosTime.js";

export default class StayController {

  static async create(req, res) {
    try {
      const {
        tenant_id,
        room_id,
        check_in,
        check_out,
        status
      } = req.body;
      const validate = await validateData({ tenant_id, room_id, check_in, check_out, status });
      if (validate.length > 0) {
        return SendError(res, 400, "BadRequest: " + validate.join(", "));
      }
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      const stay = await prisma.stay.create({
        data: {
           tenant_id,
           room_id,
           check_in,
           check_out,
           status,
           created_at: laosTime,
           updated_at: laosTime
        },
      });
      return SendCreate(res, "Stay created successfully", stay);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const stays = await prisma.stay.findMany();
      return SendSuccess(res, "All stays fetched", stays);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getById(req, res) {
    try {
      const stay_id = Number(req.params.stay_id);
      if (isNaN(stay_id)) {
        return SendError(res, 400, "BadRequest: Invalid stay_id");
      }
      const prisma = new PrismaClient();
      const stay = await prisma.stay.findFirst({ where: { stay_id } });
      if (!stay) {
        return SendError(res, 404, "NotFound: stay");
      }
      return SendSuccess(res, "Stay fetched", stay);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async updateById(req, res) {
    try {
      const stay_id = Number(req.params.stay_id);
      if (isNaN(stay_id)) {
        return SendError(res, 400, "BadRequest: Invalid stay_id");
      }
      const {
        tenant_id,
        room_id,
        check_in,
        check_out,
        status
      } = req.body;
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      const updatedStay = await prisma.stay.update({
        where: { stay_id },
        data: {
           tenant_id,
           room_id,
           check_in,
           check_out,
           status,
           updated_at: laosTime
          },
      });
      return SendSuccess(res, "Stay updated", updatedStay);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async delete(req, res) {
    try {
      const stay_id = Number(req.params.stay_id);
      if (isNaN(stay_id)) {
        return SendError(res, 400, "BadRequest: Invalid stay_id");
      }
      const prisma = new PrismaClient();
      const deletedStay = await prisma.stay.delete({ where: { stay_id } });
      return SendSuccess(res, "Stay deleted", deletedStay);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }
}
