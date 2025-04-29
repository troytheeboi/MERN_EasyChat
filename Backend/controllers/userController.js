import User from "../models/User.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user by Google ID
export const getGoogleUser = async (req, res) => {
  try {
    const user = await User.findByGoogleId(req.params.googleId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by Google ID
export const updateGoogleUser = async (req, res) => {
  try {
    // First find the user by Google ID
    const user = await User.findByGoogleId(req.params.googleId);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Then update using the MongoDB ID
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
