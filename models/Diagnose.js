import { Schema, model } from "mongoose";

const DiagnoseSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    prescription: {
      type: String,
      required: true,
    },
    medicines: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],
    tests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model("Diagnose", DiagnoseSchema);
