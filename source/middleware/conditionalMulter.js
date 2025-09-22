
import multer from "multer";
import { userStorage, tenantStorage } from "../configuration/cloudinary.folderImage.js";

const uploadUser = multer({ storage: userStorage });
const uploadTenant = multer({ storage: tenantStorage });

export const conditionalUserMulter = (req, res, next) => {
    if (req.is('multipart/form-data')) {
        return uploadUser.single('profile')(req, res, next);
    }
    next();
}
export const conditionalTenantMulter = (req, res, next) => {

    if (req.is('multipart/form-data')) {
        return uploadTenant.single('profile')(req, res, next);
    }
    next();
}
