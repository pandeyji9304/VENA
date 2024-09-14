import { Router } from "express";
import {
  createDiagnose,
  getDiagnosesByPatient,
  getDiagnosesByDoctor
} from "../controllers/diagnose.controller.js";

const diagnoseRouter = Router();

diagnoseRouter.post("/", createDiagnose);
diagnoseRouter.get("/patient/:patientId", getDiagnosesByPatient);
diagnoseRouter.get("/doctor/:doctorId", getDiagnosesByDoctor)

export default diagnoseRouter;
