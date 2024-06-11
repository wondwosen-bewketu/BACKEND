// controllers/user.js
const userModel = require('../schema/user');
const { hashCompare, createToken, hashPassword } = require('../middleware/isAuthorized'); // Ensure correct import

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt with email:", email); // Log the email to debug

    const user = await userModel.findOne({ email });

    console.log("User found:", user); // Log the user to debug

    if (!user) return res.status(404).json({ message: 'Invalid Credentials - User not found' });

    

    const token = await createToken({ userId: user._id });
    return res.status(200).json({ user, token, message: "Login Successful!" });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const doesUserExist = await userModel.findOne({ email });

    if (doesUserExist)
      return res.status(400).json({ message: 'User Already Exists' });

    // const hashedPassword = await hashPassword(password); // Correctly use hashPassword

    const user = await userModel.create({
      name,
      email,
      password
    });

    const token = await createToken({ userId: user._id });
    return res.status(201).json({ user, token });
  } catch (error) {
    console.error('Error during sign-up:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


// Getting details of logged in user
exports.getUserDetails = async (req, res) => {
  try {
    if (!req.user) return res.status(400).json({ message: "Invalid request" });
    const user = await userModel.findOne(req.user._id);

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Some thing gone wrong" });
  }
};
