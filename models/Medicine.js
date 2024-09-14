import { Schema, model } from "mongoose";

const MedicineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Prescription", "Over-the-counter"],
      default: "Prescription",
    },
    description: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
    },
    dosageForm: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Medicine", MedicineSchema);
