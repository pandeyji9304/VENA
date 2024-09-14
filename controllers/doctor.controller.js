import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js"; // Assuming you have a User model for doctors
import { generatePassword } from "../utils/password.utils.js"; // Function to generate random password
import { sendEmail } from "../utils/email.utils.js"; // Function to send email
import { calculateTimeSlots } from "../utils/extras.js";
import { addDoctorToHospital } from "./hospital.controller.js";
import { generateToken } from "../utils/server.utils.js";

const registerDoctor = async (req, res) => {
  try {
    const password = generatePassword();
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      phone: req.body.phone,
      password: password,
      role: "doctor",
    });

    const newDoctor = new Doctor({
      userId: "",
      hospitalId: req.body.hospitalId,
      licenseNo: req.body.licenseNo,
      specialization: req.body.specialization,
      experienceYears: req.body.experienceYears,
      qualification: req.body.qualification,
      workingHours: req.body.workingHours,
      duration: req.body.duration,
      about: req.body.about,
    });
    await newUser.save();
    newDoctor.userId = newUser._id;
    await newDoctor.save();

    await sendEmail(
      newUser.email,
      "Your Temporary Password",
      `Your temporary password is: ${password} Please change it after logging in.`
    );
    await addDoctorToHospital(req.body.hospitalId, newDoctor._id);

    return res.status(200).json({ message: "Doctor registered successfully!" });
  } catch (error) {
    console.error("Error registering doctor:", error);
    return res.status(400).json({ error: error.message });
  }
};

const loginDoctor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: "doctor" });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const doctor = await Doctor.findOne({ userId: user._id });
    user.password = undefined;
    doctor.userId = user;
    const accessToken = generateToken(user);
    res.status(200).json({ accessToken, doctor });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addSlots = async (req, res) => {
  const doctorId = req.params.doctorId;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const { schedule, from, to, duration } = req.body;

    const validSchedules = ["EVERY_DAY", "MON_SAT", "CUSTOM"];
    if (!validSchedules.includes(schedule)) {
      return res
        .status(400)
        .json({ error: `Invalid schedule type: ${schedule}` });
    }

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: 'Both "from" and "to" times are required.' });
    }

    const daysOfWeek = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];
    const updatedWorkingHours = daysOfWeek.map((day) => ({
      day,
      workingHours: { from, to },
    }));

    doctor.schedule = schedule;
    doctor.duration = duration;
    doctor.workingHours = updatedWorkingHours;
    await doctor.save();

    return res.status(200).json({ message: "Slots added successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "-password");
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getBySpecialisation = async (req, res) => {
  let specialization = req.query.specs;
  try {
    const doctors = await Doctor.find({ specialization }).populate(
      "userId",
      "-password"
    );
    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAvailableTimeSlots = async (req, res) => {
  const doctorId = req.params.doctorId;
  const date = req.query.date || new Date().toISOString().slice(0, 10);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (new Date(date) < today) {
    return res.status(400).json({ error: "Invalid date" });
  }

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const dayOfWeek = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();
    const workingDay = doctor.workingHours.find((day) => day.day === dayOfWeek);

    if (!workingDay) {
      return res.status(200).json({ timeSlots: [] });
    }

    const startTime = workingDay.workingHours.from;
    const endTime = workingDay.workingHours.to;
    const duration = doctor.duration;
    const timeSlots = [];

    let currentTime = new Date(`${date}T${startTime}:00Z`);
    const endTimeDate = new Date(`${date}T${endTime}:00Z`);

    while (currentTime < endTimeDate) {
      const nextTime = new Date(currentTime.getTime() + duration * 60000);
      if (nextTime > endTimeDate) break;

      timeSlots.push({
        from: currentTime.toISOString().slice(11, 16),
        to: nextTime.toISOString().slice(11, 16),
        date: date,
        dateAndTime: currentTime.toISOString(),
        isBooked: false,
      });
      console.log("from: ", currentTime.toISOString());
      currentTime = nextTime;
    }

    const bookedAppointments = await Appointment.find({
      doctorId: doctorId,
      dateAndTime: {
        $gte: new Date(`${date}T00:00:00Z`),
        $lt: new Date(`${date}T23:59:59Z`),
      },
    });

    const bookedTimes = bookedAppointments.map((app) => {
      const appDate = new Date(app.dateAndTime);
      return {
        from: appDate.toISOString().slice(11, 16),
        to: new Date(appDate.getTime() + duration * 60000)
          .toISOString()
          .slice(11, 16),
      };
    });

    timeSlots.forEach((slot) => {
      if (
        bookedTimes.some(
          (time) => time.from === slot.from && time.to === slot.to
        )
      ) {
        slot.isBooked = true;
      }
    });

    return res.status(200).json({ timeSlots });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    await doctor.remove();
    return res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  registerDoctor,
  loginDoctor,
  getAllDoctors,
  getBySpecialisation,
  getAvailableTimeSlots,
  addSlots,
  deleteDoctor,
};
