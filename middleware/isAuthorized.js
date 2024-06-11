// middleware/isAuthorized.js
const userModel = require("../schema/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("./config"); // Adjust the path as necessary
const SALT = 10;

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(SALT);
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

const hashCompare = async (password, hashedPassword) => {
  try {
    // Use bcrypt.compare to compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const createToken = async (payload) => {
  let token = await jwt.sign(payload, config.secret, { expiresIn: "3d" });
  return token;
};

const decodeToken = async (token) => {
  try {
    let data = await jwt.verify(token, config.secret);
    return data;
  } catch (error) {
    return new Error("Invalid Token");
  }
};

const validate = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(" ")[1]; // Extract token without "Bearer " prefix
      const data = await decodeToken(token);
      console.log("Decoded token data:", data); // Log the decoded token data

      // Check if data contains userId
      if (!data || !data.userId) {
        return res.status(401).json({ message: "Invalid Token - Missing UserID" });
      }

      // Attempt to find the user
      const user = await userModel.findById(data.userId);

      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: "Invalid Credentials - User Not Found" });
      }
    } catch (error) {
      console.error("Error validating token:", error);
      res.status(401).json({ message: "Invalid Token - Error Decoding" });
    }
  } else {
    res.status(400).json({ message: "No Token Found" });
  }
};

module.exports = {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
};
