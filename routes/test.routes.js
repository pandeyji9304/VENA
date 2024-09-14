import { Router } from "express";
import {
  createMultipleTests,
  createTest,
  getTests,
} from "../controllers/test.controller.js";

const testRouter = Router();

testRouter.post("/", createTest).get("/", getTests);
testRouter.post("/multiple", createMultipleTests);

export default testRouter;
