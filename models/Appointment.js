import { Schema, model } from "mongoose";

const AppointmentSchema = new Schema(
  {
    feesType: {
      type: Schema.Types.ObjectId,
      ref: "FeesType",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    desc: {
      type: String,
      default: "",
    },
    dateAndTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed", "noShow"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Appointment", AppointmentSchema);
