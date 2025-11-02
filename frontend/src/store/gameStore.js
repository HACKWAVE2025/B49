import { create } from "zustand";
import { updateGameScore, getLeaderboard } from "../utils/gameApi";
import { getProfile } from "../utils/userApi";
import { updateUserPoints } from "../utils/gameApi";

// ✅ API call to update points

export const useGameStore = create((set, get) => ({
  currentLevel: 0,
  points: 0,
  questionsAnswered: 0,
  showQuiz: false,
  currentQuestion: null,
  gameRunning: true,
  leaderboard: [],
  loading: false,

  // ⚙️ Setters
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setQuestionsAnswered: (count) => set({ questionsAnswered: count }),
  setShowQuiz: (val) => set({ showQuiz: val }),
  setCurrentQuestion: (q) => set({ currentQuestion: q }),
  setGameRunning: (val) => set({ gameRunning: val }),

  // 🧠 Fetch player details (level, points)
  fetchPlayerDetails: async () => {
    try {
      const username = localStorage.getItem("username");
      if (!username) return;

      const profile = await getProfile(username);
      if (profile) {
        set({
          currentLevel: profile.level || 0,
          points: profile.points || 0,
        });
      }
    } catch (err) {
      console.error("❌ Error fetching player details:", err);
    }
  },

  // 🧩 Post points update
  // postPoints: updateUserPoints(userId, pointsToAdd),


  // 🧱 Post level update (manually if needed)
  postLevel: (newLevel) => {
    set({ currentLevel: newLevel });
  },

  // 🏆 Fetch leaderboard
  fetchLeaderboard: async () => {
    set({ loading: true });
    try {
      const topUsers = await getLeaderboard();
      set({ leaderboard: topUsers });
    } catch (err) {
      console.error("❌ Error fetching leaderboard:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
