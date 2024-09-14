import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs";

const isPasswordCorrect = async (password, hashedPassword) => {
  return await bycrypt.compare(password, hashedPassword);
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      userEmail: user.email,
      userRole: user.role,
    },
    process.env.JWT_SECRET
  );
};

export { isPasswordCorrect, generateToken };
