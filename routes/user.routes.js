import { Router } from "express";
import {
  login,
  updateDoctorProfileImages,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/auth/login", login);
userRouter.put("/doctor/addImages", updateDoctorProfileImages);

export default userRouter;
