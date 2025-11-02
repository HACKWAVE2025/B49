export default function LevelCompleteModal({ level, correct, onNext }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50">
      <div className="p-8 bg-[#081616] border border-[#00ff88] rounded-2xl text-white text-center font-mono">
        <h2 className="text-3xl font-bold text-[#00ff88] mb-4">Level {level} Complete!</h2>
        <p className="mb-6">You got {correct}/5 correct!</p>
        <button onClick={onNext} className="px-6 py-2 bg-[#00ff88] text-black font-bold rounded-xl hover:scale-105 transition">Next Level</button>
      </div>
    </div>
  );
}