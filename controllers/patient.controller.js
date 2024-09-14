import Apppointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import { generateToken } from "../utils/server.utils.js";
// import { bycrypt } from "bcryptjs";

const registerPatient = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // const hashedPassword = await bycrypt.hash(password, 10);

    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      role: "patient",
    });
    await newUser.save();

    const newPatient = await Patient.create({
      userId: newUser._id,
      hospitalId: req.body.hospitalId,
      dob: req.body.dob,
      height: req.body.height,
      weight: req.body.weight,
      sugar: req.body.sugar,
      address: req.body.address,
      patientID: Date.now().toString(8).toUpperCase(),
    });
    await newPatient.save();

    const accessToken = generateToken(newUser);
    newUser.password = undefined;
    newPatient.userId = newUser;
    return res.status(200).json({
      accessToken,
      message: "User created successfully!",
      patient: newPatient,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password, role: "patient" });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }
    const patient = await Patient.findOne({ userId: user._id });
    user.password = undefined;
    patient.userId = user;
    const accessToken = generateToken(user);

    return res.status(200).json({
      accessToken,
      message: "User logged in successfully",
      patient,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const patient = await Patient.findById(patientId).populate(
      "userId",
      "-password"
    );
    return res.status(200).json({
      message: "Patient fetched successfully",
      patient,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllPatients = async (req, res) => {
  // const { hospitalId } = req.params;
  try {
    const patients = await Patient.find().populate("userId", "-password");
    return res.status(200).json({
      message: "Patients fetched successfully",
      patients,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAppointments = async (req, res) => {
  const { patientId } = req.params;
  try {
    // const patient = await Patient.findById(patientId).populate("userId");
    const appointments = await Apppointment.find({ patientId }).populate(
      "doctorId",
      "-password"
    );
    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export {
  registerPatient,
  loginPatient,
  getPatient,
  getAllPatients,
  getAppointments,
};
