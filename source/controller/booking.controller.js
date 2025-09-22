
import { PrismaClient } from "@prisma/client";
import { SendSuccess, SendCreate, SendError } from "../service/response.js";
import { validateData } from "../service/validateData.js";
import { getLaosTime } from "../service/getLaosTime.js";

export default class BookingController {

  static async create(req, res) {
    try {
      const {
        tenant_id,
        room_id,
        booking_date,
        status
      } = req.body;
      const validate = await validateData({ tenant_id, room_id, booking_date, status });
      if (validate.length > 0) {
        return SendError(res, 400, "BadRequest: " + validate.join(", "));
      }
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      const booking = await prisma.booking.create({
        data: {
           tenant_id,
           room_id,
           booking_date,
           status,
           created_at: laosTime,
           updated_at: laosTime
        },
      });
      return SendCreate(res, "Booking created successfully", booking);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const bookings = await prisma.booking.findMany();
      return SendSuccess(res, "All bookings fetched", bookings);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getById(req, res) {
    try {
      const booking_id = Number(req.params.booking_id);
      if (isNaN(booking_id)) {
        return SendError(res, 400, "BadRequest: Invalid booking_id");
      }
      const prisma = new PrismaClient();
      const booking = await prisma.booking.findFirst({ where: { booking_id } });
      if (!booking) {
        return SendError(res, 404, "NotFound: booking");
      }
      return SendSuccess(res, "Booking fetched", booking);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async updateById(req, res) {
    try {
      const booking_id = Number(req.params.booking_id);
      if (isNaN(booking_id)) {
        return SendError(res, 400, "BadRequest: Invalid booking_id");
      }
      const {
        tenant_id,
        room_id,
        booking_date,
        status
      } = req.body;
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      const updatedBooking = await prisma.booking.update({
        where: { booking_id },
        data: {
          tenant_id,
          room_id,
          booking_date,
          status,
          updated_at: laosTime
        },
      });
      return SendSuccess(res, "Booking updated", updatedBooking);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async delete(req, res) {
    try {
      const booking_id = Number(req.params.booking_id);
      if (isNaN(booking_id)) {
        return SendError(res, 400, "BadRequest: Invalid booking_id");
      }
      const prisma = new PrismaClient();
      const deletedBooking = await prisma.booking.delete({ where: { booking_id } });
      return SendSuccess(res, "Booking deleted", deletedBooking);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }
}
