import userModel from "../models/users.models";
import Jwt from "jsonwebtoken";
import bcrypt, { genSalt, hash } from "bcrypt";

export const signUp = async (req, res) => {
  try {
    const { fullname, username, password } = req.body;
    if (!username) {
      return res.status(400).json({
        status: "400",
        message: "Username is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        status: "400",
        message: "Password is required",
      });
    }
    const checkUsername = await userModel.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({
        status: "400",
        message: "Email or phone number already exist",
      });
    }
    const encryptPassword = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, encryptPassword);
    const addUser = await userModel.create({
      fullname,
      username,
      password: hashedPassword,
    });
    return res.status(200).json({
      status: "200",
      message: "User registered",
      data: addUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to register",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const userData = await userModel.findOne({ username: req.body.username });
    if (!userData) {
      return res.status(404).json({
        status: "404",
        message: "User not found",
      });
    }
    const isMacth = await bcrypt.compare(req.body.password, userData.password);
    if (!isMacth) {
      return res.status(400).json({
        status: "400",
        message: "Incorrect password",
      });
    }
    const token = await Jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRE_DATE,
    });
    return res.status(200).json({
      status: "200",
      message: "Login succeed",
      data: userData,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Login failed",
      error: error.message,
    });
  }
};

export const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, username, password, role } = req.body;
    const checkUsername = await userModel.findOne({ username });
    if (checkUsername) {
      if (checkUsername._id != id) {
        return res.status(400).json({
          status: "400",
          message: "Username or phone number exist",
        });
      }
    }
    const checkUser = await userModel.findById(id);
    if (!checkUser) {
      return res.status(404).json({
        status: "404",
        message: "User not found",
      });
    }
    if (password) {
      const encryptPassword = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, encryptPassword);
      const updatedUser = await userModel.findByIdAndUpdate(id, {
        fullname,
        username,
        password: hashedPassword,
        role,
      },{ new: true } );
      return res.status(200).json({
        status: "200",
        message: "User Update succeed",
      });
    } else {
      const updatedUser = await userModel.findByIdAndUpdate(id, {
        fullname,
        username,
        role,
      },{ new: true });
      return res.status(200).json({
        status: "200",
        message: "User Update succeed",
        data: updatedUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to update data",
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({
      status: "200",
      message: "All users retrieved",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const singleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "404",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "200",
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to data",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await userModel.findById(id);
    if (!findUser) {
      return res.status(404).json({
        status: "404",
        message: "User not found",
      });
    }
    const deletedUser = await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      status: "200",
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to delete data",
      error: error.message,
    });
  }
};
