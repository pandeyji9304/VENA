import { Router } from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointmentsDoctor,
  getAllAppointmentsPatient,
} from "../controllers/appointment.controller.js";
import { authenticateToken } from "../middlewares/authHelper.js";

const appointmentRouter = Router();

appointmentRouter.use(authenticateToken);

appointmentRouter.post("/", createAppointment);

appointmentRouter.delete("/:id", deleteAppointment);

appointmentRouter.get("/patient/:patientId", getAllAppointmentsPatient);
appointmentRouter.get("/doctor/:doctorId", getAllAppointmentsDoctor);

export default appointmentRouter;
