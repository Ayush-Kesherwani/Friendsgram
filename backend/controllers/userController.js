import User from "../models/User.js";

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "name email profilePic")
      .populate("following", "name email profilePic");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, bio },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const imagePath = `/uploads/profilePics/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { profilePic: imagePath },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile pic update failed" });
  }
};

export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following.pull(targetUserId);
      userToFollow.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      userToFollow.followers.push(currentUserId);
    }

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: isFollowing ? "User unfollowed" : "User followed" });
  } catch (error) {
    console.error("Error in followUser:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const unfollowUser = async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user._id;

  try {
    const userToUnfollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    userToUnfollow.followers.pull(currentUserId);
    currentUser.following.pull(id);

    await userToUnfollow.save();
    await currentUser.save();

    res.status(200).json({ message: "User unfollowed" });
  } catch (err) {
    console.error("Error in unfollowUser:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
