import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import { generateToken } from "../utils/server.utils.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordCorrect = user.password == password; // Assuming you have a method to compare passwords
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    user.password = undefined;
    let accessToken = "";

    const role = user.role;
    switch (role) {
      case "doctor":
        const doctor = await Doctor.findOne({ userId: user._id });
        if (!doctor) {
          return res.status(404).json({ error: "Doctor profile not found" });
        }
        doctor.userId = user;
        accessToken = generateToken(user);
        return res.status(200).json({ accessToken, doctor });
      case "patient":
        const patient = await Patient.findOne({ userId: user._id });
        if (!patient) {
          return res.status(404).json({ error: "Patient profile not found" });
        }
        patient.userId = user;
        accessToken = generateToken(user);
        return res.status(200).json({ accessToken, patient });
      case "admin":
        accessToken = generateToken(user);
        return res.status(200).json({ accessToken, user });
      default:
        return res.status(400).json({ error: "Invalid role" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateDoctorProfileImages = async (req, res) => {
  const { images, gender } = req.body;
  const doctors = await User.find({ role: "doctor", gender: gender });

  const bulkWrites = doctors.map((doctor) => {
    const randomImageIndex = Math.floor(Math.random() * images.length);
    doctor.profileImage = images[randomImageIndex];
    return {
      updateOne: {
        filter: { _id: doctor._id },
        update: { $set: { profileImage: doctor.profileImage } },
      },
    };
  });

  await User.bulkWrite(bulkWrites);

  res.status(200).send("Profile images updated successfully");
};

export { login, updateDoctorProfileImages };
