import Appointment from "../models/Appointment.js";
import Diagnose from "../models/Diagnose.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

const createDiagnose = async (req, res) => {
  const { patientId, doctorId, appointmentId } = req.body;
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    const existingDiagnose = await Diagnose.findOne({ appointmentId });
    if (existingDiagnose) {
      return res.status(400).json({ error: "Diagnose already done" });
    }
    appointment.status = "completed";
    await appointment.save()
    const diagnose = new Diagnose({
      patientId,
      doctorId,
      appointmentId,
      prescription: req.body.prescription,
      medicines: req.body.medicines, //[medicineIDs]
      tests: req.body.tests, //[testIDs]
    });
    await diagnose.save();
    res.status(200).json({ message: "Diagnose successful", diagnose });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDiagnosesByPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const diagnoses = await Diagnose.find({ patientId }).populate([
      { path: "medicines" },
      { path: "tests" },
      { 
        path: "doctorId",
        select: "-workingHours", // Exclude the workingHours field from doctor
        populate: {
          path: "userId",
          select: "-password" // Exclude the password field from user
        }
      },
      { path: "appointmentId",
        populate: {
          path: "feesType"
        }
       }
    ]);

    res.status(200).json({ message: "Diagnoses fetched successfully", diagnoses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDiagnosesByDoctor = async(req,res) => {
  const { doctorId } = req.params;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const diagnoses = await Diagnose.find({ doctorId }).populate([
      { path: "medicines" },
      { path: "tests" },
      { 
        path: "patientId",
        populate: {
          path: "userId",
          select: "-password" // Exclude the password field from user
        }
      },
      { path: "appointmentId",
        populate: {
          path: "feesType"
        }
       }
    ]);

    res.status(200).json({ message: "Diagnoses fetched successfully", diagnoses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { createDiagnose, getDiagnosesByPatient, getDiagnosesByDoctor };
