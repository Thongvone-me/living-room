
import express from "express";
import multer from "multer";
import { userStorage, tenantStorage } from "../configuration/cloudinary.js";
import { authentication } from "../middleware/authentication.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import UserController from "../controller/user.controller.js";
import TenantController from "../controller/tenant.controller.js";
import RoomTypeController from "../controller/roomtype.controller.js";
import RoomController from "../controller/room.controller.js";
import RentalContractController from "../controller/rentalcontract.controller.js";
import BookingController from "../controller/booking.controller.js";
import StayController from "../controller/stay.controller.js";
import PaymentController from "../controller/payment.controller.js";
import NotificationController from "../controller/notification.controller.js";
import { conditionalMulter } from "../middleware/conditionalMulter.js";
const route = express.Router();


const user = "/user";const uploadUser = multer({ storage: userStorage });
route.post(`${user}/register`, uploadUser.single('profile'), UserController.Register);
route.post(`${user}/login`, UserController.Login);
route.put(`${user}/refreshToken`, authentication, UserController.RefreshToken);
route.post(`${user}/forgotPassword`, UserController.ForgotPassword);
route.get(`${user}/getAll`, authentication, authorizeRoles("admin"), UserController.getAll);
route.get(`${user}/getOne/:user_id`, authentication, UserController.getById);
route.put(`${user}/update/:user_id`, conditionalMulter, authentication, authorizeRoles("admin"), UserController.update);
route.delete(`${user}/delete/:user_id`, authentication, authorizeRoles("admin"), UserController.delete);

const tenant = "/tenant";
const uploadTenant = multer({ storage: tenantStorage });
route.post(`${tenant}/insert`, uploadTenant.single('profile'), authentication, TenantController.create);
route.get(`${tenant}/getAll`, authentication, authorizeRoles("admin"), TenantController.getAll);
route.get(`${tenant}/getOne/:tenant_id`, authentication, TenantController.getById);
route.put(`${tenant}/update/:tenant_id`, authentication, authorizeRoles("admin"), TenantController.updateById);
route.delete(`${tenant}/delete/:tenant_id`, authentication, authorizeRoles("admin"), TenantController.delete);

const roomtype = "/roomtype";
route.post(`${roomtype}/insert`, authentication, authorizeRoles("admin"), RoomTypeController.create);
route.get(`${roomtype}/getAll`, RoomTypeController.getAll);
route.get(`${roomtype}/getOne/:roomtype_id`, RoomTypeController.getById);
route.put(`${roomtype}/update/:roomtype_id`, authentication, authorizeRoles("admin"), RoomTypeController.updateById);
route.delete(`${roomtype}/delete/:roomtype_id`, authentication, authorizeRoles("admin"), RoomTypeController.delete);

const room = "/room";
route.post(`${room}/insert`, authentication, authorizeRoles("admin"), RoomController.create);
route.get(`${room}/getAll`, RoomController.getAll);
route.get(`${room}/getOne/:room_id`, RoomController.getById);
route.get(`${room}/getStatus/:room_id`, RoomController.getOnlyStatus);
route.put(`${room}/update/:room_id`, authentication, authorizeRoles("admin"), RoomController.updateById);
route.delete(`${room}/delete/:room_id`, authentication, authorizeRoles("admin"), RoomController.delete);

const rentalcontract = "/rentalcontract";
route.post(`${rentalcontract}/insert`, authentication, RentalContractController.create);
route.get(`${rentalcontract}/getAll`, RentalContractController.getAll);
route.get(`${rentalcontract}/getOne/:rentalcontract_id`, RentalContractController.getById);
route.put(`${rentalcontract}/update/:rentalcontract_id`, authentication, authorizeRoles("admin"), RentalContractController.updateById);
route.delete(`${rentalcontract}/delete/:rentalcontract_id`, authentication, authorizeRoles("admin"), RentalContractController.delete);

const booking = "/booking";
route.post(`${booking}/insert`, authentication, BookingController.create);
route.get(`${booking}/getAll`, authentication, authorizeRoles("admin"), BookingController.getAll);
route.get(`${booking}/getOne/:booking_id`, authentication, BookingController.getById);
route.put(`${booking}/update/:booking_id`, authentication, authorizeRoles("admin"), BookingController.updateById);
route.delete(`${booking}/delete/:booking_id`, authentication, authorizeRoles("admin"), BookingController.delete);

const stay = "/stay";
route.post(`${stay}/insert`, authentication, StayController.create);
route.get(`${stay}/getAll`, authentication, authorizeRoles("admin"), StayController.getAll);
route.get(`${stay}/getOne/:stay_id`, authentication, StayController.getById);
route.put(`${stay}/update/:stay_id`, authentication, authorizeRoles("admin"), StayController.updateById);
route.delete(`${stay}/delete/:stay_id`, authentication, authorizeRoles("admin"), StayController.delete);

const payment = "/payment";
route.post(`${payment}/insert`, authentication, PaymentController.create);
route.get(`${payment}/getAll`, authentication, authorizeRoles("admin"), PaymentController.getAll);
route.get(`${payment}/getOne/:payment_id`, authentication, PaymentController.getById);
route.put(`${payment}/update/:payment_id`, authentication, authorizeRoles("admin"), PaymentController.updateById);
route.delete(`${payment}/delete/:payment_id`, authentication, authorizeRoles("admin"), PaymentController.delete);

const notification = "/notification";
route.post(`${notification}/insert`, authentication, NotificationController.create);
route.get(`${notification}/getAll`, authentication, authorizeRoles("admin"), NotificationController.getAll);
route.get(`${notification}/getOne/:notification_id`, authentication, NotificationController.getById);
route.put(`${notification}/update/:notification_id`, authentication, authorizeRoles("admin"), NotificationController.updateById);
route.delete(`${notification}/delete/:notification_id`, authentication, authorizeRoles("admin"), NotificationController.delete);

export default route;