import { Router } from "express";
import {
  createMedicine,
  createMultipleMedicines,
  getMedicines,
} from "../controllers/medicine.controller.js";

const medicineRouter = Router();

medicineRouter.post("/", createMedicine).get("/", getMedicines);
medicineRouter.post("/multiple", createMultipleMedicines);

export default medicineRouter;
