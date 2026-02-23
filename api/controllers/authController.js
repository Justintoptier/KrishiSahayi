const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, upiId, address } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const user = await User.create({ name, email, password, role, phone, upiId, address });
    if (user) {
      res.status(201).json({
        success: true,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, upiId: user.upiId, address: user.address },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, upiId: user.upiId, address: user.address },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, upiId: user.upiId, address: user.address },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};