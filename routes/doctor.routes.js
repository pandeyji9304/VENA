import { Router } from "express";
import {
  registerDoctor,
  getAllDoctors,
  getAvailableTimeSlots,
  getBySpecialisation,
  addSlots,
  loginDoctor,
} from "../controllers/doctor.controller.js";
import { authenticateToken } from "../middlewares/authHelper.js";

const doctorRouter = Router();

doctorRouter
  .post("/auth/register", registerDoctor)
  .post("/auth/login", loginDoctor);

doctorRouter.use(authenticateToken);

doctorRouter.get("/", getAllDoctors);
doctorRouter.get("/by", getBySpecialisation);
doctorRouter
  .get("/:doctorId/slots", getAvailableTimeSlots)
  .put("/:doctorId/slots", addSlots);

export default doctorRouter;
