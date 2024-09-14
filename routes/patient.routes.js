import { Router } from "express";
import {
  getAllPatients,
  getPatient,
  loginPatient,
  registerPatient,
} from "../controllers/patient.controller.js";
import { authenticateToken } from "../middlewares/authHelper.js";

const patientRouter = Router();

//Authentication
patientRouter
  .post("/auth/register", registerPatient)
  .post("/auth/login", loginPatient);

patientRouter.use(authenticateToken);

patientRouter.get("/:patientId", getPatient);
patientRouter.get("/", getAllPatients);

export default patientRouter;
