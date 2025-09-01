
import { PrismaClient } from "@prisma/client";
import { SendSuccess, SendCreate, SendError } from "../service/response.js";
import { validateData } from "../service/validate.js";
import { getLaosTime } from "../service/getLaosTime.js";

export default class RentalContractController {

  static async create(req, res) {
    try {
      const {
        tenant_id,
        room_id,
        start_date,
        end_date,
        rent_amount,
        deposit,
        status
      } = req.body;
      const validate = await validateData({ tenant_id, room_id, start_date, end_date, rent_amount, deposit, status });
      if (validate.length > 0) {
        return SendError(res, 400, "BadRequest: " + validate.join(", "));
      }
      const prisma = new PrismaClient();
      const laoTime = getLaosTime();
      const rentalContract = await prisma.rentalContract.create({
        data: { 
          tenant_id,
          room_id,
          start_date,
          end_date,
          rent_amount,
          deposit,
          status,
          created_at: laoTime,
          updated_at: laoTime
        },
      });
      return SendCreate(res, "RentalContract created successfully", rentalContract);
    } catch (error) {
      console.log(error);
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const rentalContracts = await prisma.rentalContract.findMany();
      return SendSuccess(res, "All rental contracts fetched", rentalContracts);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getById(req, res) {
    try {
      const rentalcontract_id = Number(req.params.rentalcontract_id);
      if (isNaN(rentalcontract_id)) {
        return SendError(res, 400, "BadRequest: Invalid rentalcontract_id");
      }
      const prisma = new PrismaClient();
      const rentalContract = await prisma.rentalContract.findFirst({ where: { rentalcontract_id } });
      if (!rentalContract) {
        return SendError(res, 404, "NotFound: rental contract");
      }
      return SendSuccess(res, "RentalContract fetched", rentalContract);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async updateById(req, res) {
    try {
      const rentalcontract_id = Number(req.params.rentalcontract_id);
      if (isNaN(rentalcontract_id)) {
        return SendError(res, 400, "BadRequest: Invalid rentalcontract_id");
      }
      const {
        tenant_id,
        room_id,
        start_date,
        end_date,
        rent_amount,
        deposit,
        status
      } = req.body;
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      const updatedRentalContract = await prisma.rentalContract.update({
        where: { rentalcontract_id },
        data: {
          tenant_id,
          room_id,
          start_date,
          end_date,
          rent_amount,
          deposit,
          status,
          updated_at: laosTime
        },
      });
      return SendSuccess(res, "RentalContract updated", updatedRentalContract);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async delete(req, res) {
    try {
      const rentalcontract_id = Number(req.params.rentalcontract_id);
      if (isNaN(rentalcontract_id)) {
        return SendError(res, 400, "BadRequest: Invalid rentalcontract_id");
      }
      const prisma = new PrismaClient();
      const deletedRentalContract = await prisma.rentalContract.delete({ where: { rentalcontract_id } });
      return SendSuccess(res, "RentalContract deleted", deletedRentalContract);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }
}
