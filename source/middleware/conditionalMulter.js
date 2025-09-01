import multer from "multer";
import { userStorage } from "../configuration/cloudinary.js";
const uploadUser = multer({ storage: userStorage });

export const conditionalMulter = (req, res, next) => {
	if (req.is('multipart/form-data')) {
		return uploadUser.single('profile')(req, res, next);
	}
	next();
}