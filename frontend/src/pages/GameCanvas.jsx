import Phaser from "phaser";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import QuizModal from "../modals/QuizModal";
import { createGameScene } from "./GameScene";
import CollisionModal from "../modals/CollisionModal";
import WrongAnswerModal from "../modals/WrongAnswerModal";
import LevelCompleteModal from "../modals/LevelCompleteModal";
import LevelFailedModal from "../modals/LevelFailedModal";
import { questions } from "../data/questions";
import { useNavigate } from "react-router-dom";
import { updateUserPoints } from "../utils/gameApi";
import { updateUserLevel } from "../utils/gameApi";

export default function GameCanvas() {
  const {
    showQuiz,
    setShowQuiz,
    setCurrentQuestion,
    gameRunning,
    setGameRunning,
    currentLevel,
    setCurrentLevel,
  } = useGameStore();

  const navigate = useNavigate();

  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(currentLevel);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionsEncountered, setQuestionsEncountered] = useState(0);
  const [showCollisionModal, setShowCollisionModal] = useState(false);
  const [showWrongAnswerModal, setShowWrongAnswerModal] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showLevelFailed, setShowLevelFailed] = useState(false);
  const username =localStorage.getItem('username');

  const gameRef = useRef(null);
  const obstacleRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const handleSpace = (e) => {
      if (e.code === "Space") {
        if (!gameRunning || showQuiz) return;

        const player = playerRef.current;
        const obstacle = obstacleRef.current;
        if (!player || !obstacle) return;

        const distance = Math.abs(obstacle.x - player.x);
        const onGround = player.body?.touching?.down;

        if (distance < 100 && onGround) {
          const randomQ = questions[Math.floor(Math.random() * questions.length)];
          setGameRunning(false);
          setShowQuiz(true);
          setCurrentQuestion(randomQ);
        } else if (onGround) {
          player.setVelocityY(-550);
        }
      }
    };

    window.addEventListener("keydown", handleSpace);
    return () => window.removeEventListener("keydown", handleSpace);
  }, [gameRunning, showQuiz, questions]);


  // 🧠 Initialize Phaser Scene
  useEffect(() => {
    const { game, cleanup } = createGameScene({
      Phaser,
      gameRef,
      playerRef,
      obstacleRef,
      gameRunning,
      level,
      setShowQuiz,
      setCurrentQuestion,
      setGameRunning,
      setQuestionsEncountered,
      checkLevelEnd,
      questions,
      setShowCollisionModal, // ✅ add this
    setPoints, // ✅ add this
    });

    return cleanup;
  }, [gameRunning, showQuiz, level]);

  // 🧮 Quiz Answer Logic
  const handleAnswer = (selectedId) => {
    const { currentQuestion } = useGameStore.getState();
    const isCorrect = selectedId === currentQuestion.right_answer;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setPoints((prev) => prev + 10);
    }
    setQuestionsEncountered((prev) => {
      const newCount = prev + 1;
      checkLevelEnd(newCount, isCorrect);
      return newCount;
    });


    setShowQuiz(false);
    resumeGame();

    if (obstacleRef.current) obstacleRef.current.x = window.innerWidth + 150;
  };


  const checkLevelEnd = (count, answeredCorrectly = false) => {
    // Estimate the "would-be" correct count if last answer is correct
    const projectedCorrect = correctAnswers + (answeredCorrectly ? 1 : 0);

    if (count >= 5) {
      setGameRunning(false);
      if (projectedCorrect >= 4) {
        updateUserLevel();
        setShowLevelComplete(true);
      } else {
        setShowLevelFailed(true);
      }
      updateUserPoints(points)
    }
  };


  // 🔄 Game Control Helpers
const resumeGame = () => {
  const scene = gameRef.current?.scene?.keys?.default;
  if (scene && scene.physics?.world) scene.physics.world.resume();
  setGameRunning(true);
};


const handleRestart = () => {
  setPoints(0);
  setShowCollisionModal(false);
  setShowWrongAnswerModal(false);
  setShowLevelFailed(false);
  setShowLevelComplete(false);
  setQuestionsEncountered(0);
  setCorrectAnswers(0);
  setGameRunning(true);
};


  const handleNextLevel = () => {
    setLevel((prev) => prev + 1);
    setShowLevelComplete(false);
    setQuestionsEncountered(0);
    setCorrectAnswers(0);
    setPoints(0);
    setGameRunning(true);
    setCurrentLevel(level);
  };

  const handleHome = () => {
    navigate("/")
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#01010a] via-[#050518] to-[#000000]">
      <div id="phaser-container" className="relative w-full h-full">
        {/* HUD */}
        <div className="absolute top-6 left-6 z-20 text-[#00ff88] font-mono text-lg font-bold space-y-1">
          <p>Points: {points}</p>
          <p>Level: {level}</p>
          <p>Correct: {correctAnswers}</p>
        </div>

        {/* Title */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20">
          <h1 className="text-5xl font-bold text-[#00bfff] animate-pulse">Replicant</h1>
          <p className="text-sm text-[#a0a0ff] mt-2 tracking-widest">Dodge meteors. Outsmart scams.</p>
        </div>

        {/* 💡 Modals */}
        {showQuiz && <QuizModal onAnswer={handleAnswer} />}
        {showCollisionModal && <CollisionModal onRestart={handleRestart} onHome={handleHome} />}
        {showWrongAnswerModal && (
          <WrongAnswerModal
            onContinue={() => {
              setShowWrongAnswerModal(false);
              resumeGame();
            }}
          />
        )}
        {showLevelComplete && (
          <LevelCompleteModal level={level} correct={correctAnswers} onNext={handleNextLevel} />
        )}
        {showLevelFailed && (
          <LevelFailedModal correct={correctAnswers} onRetry={handleRestart} onHome={handleHome} />
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#00bfff] via-[#ff4500] to-[#00bfff] blur-sm animate-pulse" />
    </div>
  );
}