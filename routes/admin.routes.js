import { Router } from "express";
import {
  addFees,
  getFees,
  homePageCount,
  loginAdmin,
  registerAdmin,
  searchPatient,
  updatFees,
} from "../controllers/admin.controller.js";
import { deleteDoctor } from "../controllers/doctor.controller.js";

const adminRouter = Router();

adminRouter
  .post("/auth/register", registerAdmin)
  .post("/auth/login", loginAdmin);

adminRouter
  .post("/fees/add", addFees)
  .get("/fees", getFees)
  .patch("/fees/:id", updatFees);
4;

adminRouter.get("/home", homePageCount);
adminRouter.get("/patient", searchPatient);

adminRouter.delete("/doctor/:doctorId", deleteDoctor);

export default adminRouter;
