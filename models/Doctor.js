import { Schema, model } from "mongoose";

const DoctorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
    },
    licenseNo: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    about: {
      type: String,
      trim: true,
    },
    // Cardiologist, Neurologist, etc
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experienceYears: {
      type: Number,
    },
    // MBBS, MD, etc
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    schedule: {
      type: String,
      enum: ["EVERY_DAY", "MON_SAT", "CUSTOM"],
    },
    workingHours: {
      type: [
        {
          day: {
            type: String,
            enum: [
              "MONDAY",
              "TUESDAY",
              "WEDNESDAY",
              "THURSDAY",
              "FRIDAY",
              "SATURDAY",
              "SUNDAY",
            ],
          },
          workingHours: {
            from: {
              type: String,
            },
            to: {
              type: String,
            },
          },
        },
      ],
    },
    duration: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Doctor", DoctorSchema);
