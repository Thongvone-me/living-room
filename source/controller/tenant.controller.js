
import { PrismaClient } from "@prisma/client";
import { SendSuccess, SendCreate, SendError } from "../service/response.js";
import { validateData } from "../service/validateData.js";
import { getLaosTime } from "../service/getLaosTime.js";
import { deleteCloudinaryImage } from "../service/deleteCloudinaryImage.js";
import { ResponseMessages } from "../service/responseMessages.js";


export default class TenantController {

  static async create(req, res) {
    try {
      const {
        first_name,
        last_name,
        gender,
        email,
        phone,
        dob,
        profile: profileFromBody
      } = req.body;
      const profile = req.file ? req.file.path : profileFromBody;
      const dobValue = dob ? new Date(dob) : null;
      const validate = await validateData({
        first_name,
        last_name,
        gender,
        email,
        phone,
        dob: dobValue
      });
      if (validate.length > 0) {
        return SendError(res, 400, "BadRequest: " + validate.join(", "));
      }
      const prisma = new PrismaClient();
      const existingEmail = await prisma.tenant.findFirst({ where: { email } });
      const existingPhone = await prisma.tenant.findFirst({ where: { phone: phone ? String(phone) : null } });
      let duplicateMsg = [];
      if (existingEmail) duplicateMsg.push('email');
      if (existingPhone) duplicateMsg.push('phone');
      if (duplicateMsg.length > 0) {
        return SendError(res, 400, 'Already exists: ' + duplicateMsg.join(', '));
      }
      const laosTime = getLaosTime();
      const tenant = await prisma.tenant.create({
        data: {
          first_name,
          last_name,
          gender,
          email,
          phone,
          dob: dobValue,
          profile,
          created_at: laosTime,
          updated_at: laosTime
        },
      });
      return SendCreate(res, "Tenant created successfully", tenant);
    } catch (error) {
      console.log(error);
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const tenants = await prisma.tenant.findMany();
      return SendSuccess(res, "All tenants fetched", tenants);
    } catch (error) {
      console.error("Tenant getAll error:", error);
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async getById(req, res) {
    try {
      const tenant_id = Number(req.params.tenant_id);
      if (isNaN(tenant_id)) {
        return SendError(res, 400, "BadRequest: Invalid tenant_id");
      }
      const prisma = new PrismaClient();
      const tenant = await prisma.tenant.findFirst({ where: { tenant_id } });
      if (!tenant) {
        return SendError(res, 404, "NotFound: tenant");
      }
      return SendSuccess(res, "Tenant fetched", tenant);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async updateById(req, res) {
    try {
      const tenant_id = Number(req.params.tenant_id);
      if (isNaN(tenant_id)) {
        return SendError(res, 400, "BadRequest: Invalid tenant_id");
      }
      const {
        first_name,
        last_name,
        gender,
        email,
        phone,
        dob,
        profile: profileFromBody
      } = req.body;
      const prisma = new PrismaClient();
      const laosTime = getLaosTime();
      const currentTenant = await prisma.tenant.findFirst({
        where: { tenant_id }
      });
      const profile = req.file ? req.file.path : (profileFromBody || (currentTenant && currentTenant.profile));
      const updatedTenant = await prisma.tenant.update({
        where: { tenant_id },
        data: { 
          first_name,
          last_name,
          gender,
          email,
          phone,
          dob: dob? new Date(dob) : (currentTenant && currentTenant.dob),
          profile,
          updated_at: laosTime
        },
      });
  return SendSuccess(res, ResponseMessages.Success.Update, updatedTenant);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }

  static async delete(req, res) {
    try {
      const tenant_id = Number(req.params.tenant_id);
      if (isNaN(tenant_id)) {
        return SendError(res, 400, "BadRequest: Invalid tenant_id");
      }
      const prisma = new PrismaClient();
      const tenant = await prisma.tenant.findFirst({ where: { tenant_id } });
      if (!tenant) {
        return SendError(res, 404, "NotFound: tenant");
      }
      await deleteCloudinaryImage(tenant.profile);
      const deletedTenant = await prisma.tenant.delete({ where: { tenant_id } });
  return SendSuccess(res, ResponseMessages.Success.Delete, deletedTenant);
    } catch (error) {
      return SendError(res, 500, "ServerInternal", error);
    }
  }
}
