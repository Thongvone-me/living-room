
import { PrismaClient } from "@prisma/client";
import { SendSuccess, SendCreate, SendError } from "../service/response.js";
import { validateData } from "../service/validate.js";
import { getLaosTime } from "../service/getLaosTime.js";

export default class PaymentController {

  static async create(req, res) {
    try {
      const {
        tenant_id,
        user_id,
        stay_id,
        amount,
        payment_date,
        method,
        status
      } = req.body;
      const validate = await validateData({ tenant_id, user_id, stay_id, amount, payment_date, method, status });
      if (validate.length > 0) {
        return SendError(res, 400, "BadRequest: " + validate.join(", "));
      }
      const prisma = new PrismaClient();
      const payment = await prisma.payment.create({
        data: {
          tenant_id,
          user_id,
          stay_id,
          amount,
          payment_date,
          method,
          status,
          created_at: laoTime,
          updated_at: laoTime
        },
      });
      return SendCreate(res, "Payment created successfully", payment);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const payments = await prisma.payment.findMany();
      return SendSuccess(res, "All payments fetched", payments);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getById(req, res) {
    try {
      const payment_id = Number(req.params.payment_id);
      if (isNaN(payment_id)) {
        return SendError(res, 400, "BadRequest: Invalid payment_id");
      }
      const prisma = new PrismaClient();
      const payment = await prisma.payment.findFirst({ where: { payment_id } });
      if (!payment) {
        return SendError(res, 404, "NotFound: payment");
      }
      return SendSuccess(res, "Payment fetched", payment);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async updateById(req, res) {
    try {
      const payment_id = Number(req.params.payment_id);
      if (isNaN(payment_id)) {
        return SendError(res, 400, "BadRequest: Invalid payment_id");
      }
      const {
        tenant_id,
        user_id,
        stay_id,
        amount,
        payment_date,
        method,
        status
      } = req.body;
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      const updatedPayment = await prisma.payment.update({
        where: { payment_id },
        data: {
          tenant_id,
          user_id,
          stay_id,
          amount,
          payment_date,
          method,
          status,
          updated_at: laoTime
        },
      });
      return SendSuccess(res, "Payment updated", updatedPayment);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async delete(req, res) {
    try {
      const payment_id = Number(req.params.payment_id);
      if (isNaN(payment_id)) {
        return SendError(res, 400, "BadRequest: Invalid payment_id");
      }
      const prisma = new PrismaClient();
      const deletedPayment = await prisma.payment.delete({ where: { payment_id } });
      return SendSuccess(res, "Payment deleted", deletedPayment);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }
}
