import { Schema, model } from "mongoose";

const Test = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

export default model("Test", Test);
