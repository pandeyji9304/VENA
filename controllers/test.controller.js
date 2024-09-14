import Test from "../models/Test.js";

const createTest = async (req, res) => {
  try {
    const { name, price } = req.body;
    const test = new Test({ name, price });
    await test.save();
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMultipleTests = async (req, res) => {
  try {
    const tests = req.body;
    const createdTests = await Test.insertMany(tests);
    res.status(200).json(createdTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.status(200).json({
      message: "All tests",
      tests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createTest, createMultipleTests, getTests };
