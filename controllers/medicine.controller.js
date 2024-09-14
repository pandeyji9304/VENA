import Medicine from "../models/Medicine.js";

const createMedicine = async (req, res) => {
  try {
    const { name, description, dosage, dosageForm, amount } = req.body;
    const medicine = new Medicine({
      name,
      description,
      dosage,
      dosageForm,
      amount,
    });
    await medicine.save();
    res.status(200).json({
      message: "Medicine created successfully",
      medicine,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMultipleMedicines = async (req, res) => {
  try {
    const medicines = req.body;
    const createdMedicines = await Medicine.insertMany(medicines);
    res.status(200).json(createdMedicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createMedicine, createMultipleMedicines, getMedicines };
