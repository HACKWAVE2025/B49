export default function LevelFailedModal({ correct, onRetry, onHome }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50">
      <div className="p-8 bg-[#2a0a0a] border border-[#ff3333] rounded-2xl text-white text-center font-mono">
        <h2 className="text-3xl font-bold text-[#ff5555] mb-4">Level Failed</h2>
        <p className="mb-6">You got only {correct}/5 correct. Try again!</p>
        <div className="flex justify-center gap-6">
          <button onClick={onRetry} className="px-6 py-2 bg-[#ff4500] rounded-xl font-bold hover:scale-105 transition">Retry</button>
          <button onClick={onHome} className="px-6 py-2 bg-[#00ff88] text-black font-bold rounded-xl hover:scale-105 transition">Home</button>
        </div>
      </div>
    </div>
  );
}