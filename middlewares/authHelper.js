import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticateToken = async (req, res, next) => {
  if (!req.header("Authorization"))
    return res.status(401).send("Access Denied");
  const token = req.header("Authorization").split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).send("No User Found");

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    // console.log("token verified");
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send("Access Token Expired");
    }
  }
};

const verifyRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).send("Access Denied");
    next();
  };
};

export { authenticateToken, verifyRole };
