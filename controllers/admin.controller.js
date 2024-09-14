import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import FeesType from "../models/FeesType.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import { generateToken } from "../utils/server.utils.js";
import { addAdminToHospital } from "./hospital.controller.js";

const registerAdmin = async (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      gender,
      role: "admin",
    });
    user.save();
    await addAdminToHospital(user._id, req.body.hospitalId);
    const accessToken = generateToken(user);

    return res.status(201).json({
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something went wrong while registering user");
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password, role: "admin" });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.password = undefined;
    const accessToken = generateToken(user);
    res.status(200).json({ accessToken, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addFees = async (req, res) => {
  try {
    const feesExists = await FeesType.findOne({
      type: req.body.type,
      name: req.body.name,
    });
    if (feesExists) {
      return res.status(400).json({ error: "Fees already exists" });
    }

    const feesType = new FeesType({
      type: req.body.type,
      name: req.body.name,
      amount: req.body.amount,
    });
    await feesType.save();
    res.status(201).json({ message: "Fees added successfully" });
  } catch (error) {}
};

const getFees = async (req, res) => {
  const { feesType } = req.query;
  try {
    const fees = await FeesType.find({ feesType });
    if (!fees) {
      return res.status(404).json({ error: "Fees not found" });
    }
    res.status(200).json({
      fees,
      message: "Fees fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatFees = async (req, res) => {
  const { id } = req.params;
  try {
    const fees = await FeesType.findById(id);
    console.log(fees);
    if (!fees) {
      return res.status(404).json({ error: "Fees not found" });
    }
    fees.type = req.body.type || fees.type;
    fees.name = req.body.name || fees.name;
    fees.amount = req.body.amount || fees.amount;

    console.log(req.body);
    await fees.save();
    res.status(200).json({ message: "Fees updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const homePageCount = async (req, res) => {
  try {
    const patientsCount = await Patient.countDocuments();
    const doctorsCount = await Doctor.countDocuments();
    var allAppointments = await Appointment.countDocuments({
      status: "scheduled",
    });
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const todayAppointments = await Appointment.countDocuments({
      dateAndTime: { $gte: todayStart, $lt: todayEnd },
      status: "scheduled",
    });

    const upcomingAppointments = allAppointments - todayAppointments;
    res.status(200).json({
      data: {
        patientsCount,
        doctorsCount,
        upcomingAppointments,
        todayAppointments,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchPatient = async (req, res) => {
  const { search } = req.query;
  const query = User.find({
    role: "patient",
    $or: [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { patientId: search },
    ],
  });
  try {
    const patients = await query.exec();
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching patients" });
  }
};

export {
  registerAdmin,
  loginAdmin,
  addFees,
  getFees,
  updatFees,
  homePageCount,
  searchPatient,
};
