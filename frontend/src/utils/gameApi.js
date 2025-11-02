import { axiosInstance as API } from "./axiosInstance";


export const updateGameScore = async (scoreChange, newLevel) => {
  const res = await API.patch("/game/patch/updateprogress", {
    scoreChange,
    newLevel,
  });
  return res.data;
};

export const updateUserPoints = async (pointsToAdd) => {
  try {
    const res = await API.post("/game/update-points",{pointsToAdd});
    return res;
  } catch (err) {
    console.error("Error updating points:", err);
  }
};
export const updateUserLevel = async () => {
  try {
    const res = await API.post("/game/update-level");
    return res;
  } catch (err) {
    console.error("Error updating points:", err);
  }
};


export const getLeaderboard = async () => {
  const res = await API.get("/game/get/leaderboard");
  return res.data.topUsers;
};
