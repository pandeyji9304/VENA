import { Router } from "express";
import patientRouter from "./patient.routes.js";
import doctorRouter from "./doctor.routes.js";
import adminRouter from "./admin.routes.js";
import appointmentRouter from "./appointment.routes.js";
import hospitalRouter from "./hospital.routes.js";
import userRouter from "./user.routes.js";
import diagnoseRouter from "./diagnose.routes.js";
import testRouter from "./test.routes.js";
import medicineRouter from "./medicine.routes.js";

const router = Router();

router
  .use("/", userRouter)
  .use("/patient", patientRouter)
  .use("/doctor", doctorRouter)
  .use("/admin", adminRouter)
  .use("/appointment", appointmentRouter)
  .use("/hospital", hospitalRouter)
  .use("/diagnose", diagnoseRouter)
  .use("/test", testRouter)
  .use("/medicine", medicineRouter);

export default router;
