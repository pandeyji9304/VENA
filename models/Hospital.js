import { Schema, model } from "mongoose";

const HospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
    },
    licenseNo: {
      type: String,
      required: true,
      trim: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    patients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Hospital", HospitalSchema);
