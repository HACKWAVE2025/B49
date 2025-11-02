import User from "../models/User.js";


export const updatePoints = async (req, res) => {
  try {
    const { pointsToAdd } = req.body;
    console.log(pointsToAdd)
    const username = req.user.username;
    const user = await User.findOne({username});

    if (!user) return res.status(404).json({ message: "User not found" });

    // Add points
    user.points += pointsToAdd;

    await user.save();

    res.status(200).json({
      message: "Points updated successfully",
      points: user.points,
      level: user.level,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const updateLevel = async (req, res) => {
  try {
    const username = req.user.username;
    const user = await User.findOne({username});

    if (!user) return res.status(404).json({ message: "User not found" });

    // Add points
    user.level += 1;

    await user.save();

    res.status(200).json({
      message: "level updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateProgress = async (req, res) => {
  try {
    const { scoreChange, newLevel } = req.body;
    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    console.log("update progress called")
    if (typeof scoreChange === "number") {
      user.gameScore += scoreChange;
    }
    if (typeof newLevel === "number" && newLevel > user.level) {
      user.level = newLevel;
    }

    await user.save();
    return res.status(200).json({
      msg: "Progress updated successfully",
      level: user.level,
      gameScore: user.gameScore,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ gameScore: -1 })  // sort by highest gameScore
      .limit(10)                // get top 10
      .select("username points level"); // only return these fields
    console.log(topUsers)
    return res.status(200).json({ topUsers });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return res.status(500).json({ msg: "Failed to fetch leaderboard" });
  }
};

// export { updateProgress , getLeaderboard } ;
