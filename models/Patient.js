import { Schema, model } from "mongoose";

const PatientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    sugar: {
      type: Number,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    patientID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Patient", PatientSchema);
