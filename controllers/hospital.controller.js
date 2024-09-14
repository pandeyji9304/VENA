import Hospital from "../models/Hospital.js";

const registerHospital = async (req, res) => {
  try {
    // Extract hospital data from request body
    const { name, email, phone, address, logo, licenseNo } = req.body;

    // Create a new hospital instance
    const newHospital = await Hospital.create({
      name,
      email,
      phone,
      address,
      logo,
      licenseNo,
    });

    // Save the new hospital to the database
    await newHospital.save();

    // Respond with a success message
    res.status(201).json({
      message: "Hospital registered successfully!",
      hospital: newHospital,
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({ error: error.message });
  }
};

const getHospital = async (req, res) => {
  const { name, id } = req.body;
  if (name) {
    const hospital = await Hospital.findOne({ name });
    res.status(200).json(hospital);
  } else {
    const hospital = await Hospital.findById(id);
    res.status(200).json(hospital);
  }
};

const addNewPersonnel = async (req, res) => {
  const { hospitalId, doctorId, patientId } = req.params;
  try {
    if (doctorId) {
      await addDoctorToHospital(hospitalId, doctorId);
    }
    if (patientId) {
      await addPatientToHospital(hospitalId, patientId);
    }
    const hospital = await Hospital.findById(hospitalId); // Fetch the updated hospital document
    return res.status(200).json({ hospital });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const addPatientToHospital = async (hospitalId, patientId) => {
  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      throw new Error("Hospital not found");
    }
    if (patientId) {
      hospital.patients.push(patientId); // Assuming you have a 'patients' array
      await hospital.save();
    }
    return hospital;
  } catch (error) {
    throw new Error(`Failed to add patient to hospital: ${error.message}`);
  }
};

const addDoctorToHospital = async (hospitalId, doctorId) => {
  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      throw new Error("Hospital not found");
    }
    if (doctorId) {
      hospital.doctors.push(doctorId);
      await hospital.save();
    }
    return hospital;
  } catch (error) {
    throw new Error(`Failed to add patient to hospital: ${error.message}`);
  }
};

const addAdminToHospital = async (hospitalId, adminId) => {
  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      throw new Error("Hospital not found");
    }
    if (adminId) {
      hospital.admins.push(adminId);
      await hospital.save();
    }
    return hospital;
  } catch (error) {
    throw new Error(`Failed to add admin to hospital: ${error.message}`);
  }
};

export {
  registerHospital,
  getHospital,
  addNewPersonnel,
  addPatientToHospital,
  addDoctorToHospital,
  addAdminToHospital,
};
