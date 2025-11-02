export default function WrongAnswerModal({trivia, onContinue, }) {
  return (
    <div className="text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-3">❌ Wrong Answer</h2>
        <p className="text-sm text-gray-300 italic mb-4">
          💡 {trivia}
        </p>
        <button
          onClick={()=>onContinue()}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-black"
        >
          Continue
        </button>
      </div>
  );
}