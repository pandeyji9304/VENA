import { Router } from "express";
import {
  registerHospital,
  getHospital,
} from "../controllers/hospital.controller.js";

const hospitalRouter = Router();

hospitalRouter.route("/").get(getHospital).post(registerHospital);

export default hospitalRouter;
