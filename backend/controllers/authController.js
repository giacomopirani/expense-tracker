const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//Register User
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  //Validation check for missing fields
  if (!fullName || !email || !password || !profileImageUrl) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    //Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    //Create the user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });
  } catch (err) {
    res
      .staus(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

//Login User
exports.loginUser = async (req, res) => {};

//Register User
exports.getUserInfo = async (req, res) => {};
