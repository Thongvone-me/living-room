
import { PrismaClient } from "@prisma/client";
import { SendSuccess, SendCreate, SendError } from "../service/response.js";
import { validateData } from "../service/validate.js";
import { getLaosTime } from "../service/getLaosTime.js";

export default class NotificationController {

  static async create(req, res) {
    try {
      const {
        tenant_id,
        user_id,
        message,
        is_read
      } = req.body;
      const validate = await validateData({ tenant_id, user_id, message });
      if (validate.length > 0) {
        return SendError(res, 400, "BadRequest: " + validate.join(", "));
      }
      const prisma = new PrismaClient();
      const laoTime = getLaosTime();
      const notification = await prisma.notification.create({
        data: {
          tenant_id,
          user_id,
          message,
          is_read,
          created_at: laoTime,
          updated_at: laoTime
        },
      });
      return SendCreate(res, "Notification created successfully", notification);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const notifications = await prisma.notification.findMany();
      return SendSuccess(res, "All notifications fetched", notifications);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getById(req, res) {
    try {
      const notification_id = Number(req.params.notification_id);
      if (isNaN(notification_id)) {
        return SendError(res, 400, "BadRequest: Invalid notification_id");
      }
      const prisma = new PrismaClient();
      const notification = await prisma.notification.findFirst({ where: { notification_id } });
      if (!notification) {
        return SendError(res, 404, "NotFound: notification");
      }
      return SendSuccess(res, "Notification fetched", notification);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async updateById(req, res) {
    try {
      const notification_id = Number(req.params.notification_id);
      if (isNaN(notification_id)) {
        return SendError(res, 400, "BadRequest: Invalid notification_id");
      }
      const {
        tenant_id,
        user_id,
        message,
        is_read
      } = req.body;
      const prisma = new PrismaClient();
      const laoTime = getLaosTime();
      const updatedNotification = await prisma.notification.update({
        where: { notification_id },
        data: {
          tenant_id,
          user_id,
          message,
          is_read,
          updated_at: laoTime
        },
      });
      return SendSuccess(res, "Notification updated", updatedNotification);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async delete(req, res) {
    try {
      const notification_id = Number(req.params.notification_id);
      if (isNaN(notification_id)) {
        return SendError(res, 400, "BadRequest: Invalid notification_id");
      }
      const prisma = new PrismaClient();
      const deletedNotification = await prisma.notification.delete({ where: { notification_id } });
      return SendSuccess(res, "Notification deleted", deletedNotification);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }
}
