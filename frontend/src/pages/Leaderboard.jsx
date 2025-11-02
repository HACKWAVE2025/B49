import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../utils/gameApi";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#14181C] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#1E2328] rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-[#00b020] text-center">
          Global Leaderboard
        </h2>

        <ul className="space-y-3">
          {leaderboard.length > 0 ? (
            leaderboard.map((user, index) => (
              <li
                key={user.username}
                className="flex justify-between items-center bg-[#14181C] px-4 py-2 rounded-lg border border-gray-700"
              >
                <span className="text-gray-300">
                  {index + 1}.{" "}
                  <button
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="hover:underline"
                  >
                    {user.username}
                  </button>
                </span>
                <span className="text-[#00b020] font-semibold">
                  {user.points} pts
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-center">No data yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
