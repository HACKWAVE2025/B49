import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore.js";
import { questions } from "../data/questions.js";

export default function QuizModal({ onAnswer }) {
  const { currentLevel, currentQuestion, setCurrentQuestion } = useGameStore();

  const [selected, setSelected] = useState(null);
  const [showTrivia, setShowTrivia] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  console.log(currentLevel)

  // Load random question when quiz opens
    useEffect(() => {
        if (!currentQuestion) {
            const levelQuestions = questions[(currentLevel + 1).toString()];
            console.log(levelQuestions)
            const randomQ =levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
            setCurrentQuestion(randomQ);
        }
    }, [currentQuestion, setCurrentQuestion]);


  if (!currentQuestion) return null;

  const handleSelect = (optId) => {
    if (isAnswered) return;
    setSelected(optId);
    setIsAnswered(true);

    const isCorrect = optId === currentQuestion.right_answer;
    if (isCorrect) {
      onAnswer(optId);
    } else {
      // Show trivia only, don’t call parent yet
      setShowTrivia(true);
    }
  };

  const handleContinue = () => {
    // After viewing trivia, close quiz & resume game
    onAnswer(selected);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 modal-active">
      <div className="bg-gray-900 text-white p-6 rounded-xl w-96 shadow-2xl border border-green-400 font-mono">
        {!showTrivia ? (
          <>
            <h2 className="text-lg font-bold mb-4">{currentQuestion.question}</h2>
            <div className="space-y-2">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={isAnswered}
                  className={`block w-full transition p-2 rounded-md text-left ${
                    selected === opt.id
                      ? opt.id === currentQuestion.right_answer
                        ? "bg-green-600"
                        : "bg-red-600"
                      : "bg-gray-800 hover:bg-green-700"
                  }`}
                >
                  {opt.id.toUpperCase()}. {opt.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-3">Wrong Answer</h2>
            <p className="text-sm text-gray-300 italic mb-4">
              💡 {currentQuestion.trivia}
            </p>
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-black"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}