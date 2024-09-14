import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import router from "./routes/index.js";

config();  // Ensure dotenv is called early

const app = express();

app
  .use(express.json({ limit: "50kb" }))
  .use(express.urlencoded({ extended: true, limit: "50kb" }))
  .use(router);

app.get("/", (req, res) => {
  res.send("Hello World");
});


mongoose
  .connect(process.env.MONGODB_URI)  // Ensure the correct variable name
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error: ", error.message);
  });
