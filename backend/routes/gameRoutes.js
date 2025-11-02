import express from "express";
import { updateProgress, getLeaderboard , updatePoints, updateLevel} from "../controllers/gameController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.patch("/patch/updateprogress", authMiddleware, updateProgress);
router.post("/update-points", authMiddleware ,updatePoints);
router.post("/update-level", authMiddleware ,updateLevel);

router.get("/get/leaderboard", authMiddleware, getLeaderboard);

export { router };
