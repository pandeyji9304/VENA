import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

export const createAppointment = async (req, res) => {
  const { feesType, desc, dateAndTime, doctorId, patientId } = req.body;
  try {
    // existingAppointment: check if the appointment already exists for the doctor
    const existingAppointment = await Appointment.findOne({
      doctorId,
      dateAndTime,
    });
    if (existingAppointment) {
      return res
        .status(400)
        .json({ error: "Doctor already has an appointment at this time" });
    }

    // isPatientAlreadyBooked: check if the patient already has an appointment at the same time
    const isPatientAlreadyBooked = await Appointment.findOne({
      patientId,
      dateAndTime,
    });
    if (isPatientAlreadyBooked) {
      return res
        .status(400)
        .json({ error: "Patient already has an appointment at this time" });
    }

    const appointment = new Appointment({
      feesType,
      desc,
      dateAndTime,
      doctorId,
      patientId,
      status: "scheduled",
    });
    await appointment.save();
    return res
      .status(201)
      .json({ message: "Appointment created successfully" });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAllAppointmentsDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const appointments = await Appointment.find({ doctorId })
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "-password", // Exclude the password field
        },
      })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "-password",
        },
      });

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllAppointmentsPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const appointments = await Appointment.find({ patientId })
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "-password", // Exclude the password field
        },
      })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "-password",
        },
      });

    res.json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully!" });
    // Delete
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
