import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ReadingGoals() {
  const currentYear = new Date().getFullYear();

  const availableYears = [
    currentYear,
    currentYear + 1,
    currentYear + 2,
    currentYear + 3,
    currentYear + 4,
    currentYear + 5,
  ];

  const [year, setYear] = useState(currentYear);
  const [target, setTarget] = useState(0);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchGoalProgress();
  }, [year]);

  const fetchGoalProgress = async () => {
    try {
      const response = await api.get(`/api/goals/${year}`);
      setProgress(response.data);
      setTarget(response.data.target);
      setError("");
    } catch (err) {
      setProgress(null);
      setTarget(0);
    }
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.post("/api/goals", {
        year: parseInt(year),
        target_books: parseInt(target),
      });
      setMessage("Goal saved successfully!");
      fetchGoalProgress();
    } catch (err) {
      setError("Failed to save goal.");
    }
  };

  const calculatePercentage = () => {
    if (!progress || progress.target === 0) return 0;
    return Math.min((progress.current / progress.target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
          🎯 Reading Goals
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Set Your Target
            </h2>
            <form onSubmit={handleSaveGoal} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Select Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Target Books
                </label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-95"
              >
                Save Goal
              </button>

              {message && (
                <p className="text-green-600 text-sm font-bold text-center bg-green-50 p-2 rounded-lg">
                  {message}
                </p>
              )}
              {error && (
                <p className="text-red-600 text-sm font-bold text-center bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
              {year} Progress
            </h2>
            {progress ? (
              <div className="space-y-6 text-center">
                <div>
                  <span className="text-6xl font-black text-blue-600">
                    {progress.current}
                  </span>
                  <span className="text-2xl text-gray-300">
                    {" "}
                    / {progress.target}
                  </span>
                  <p className="text-gray-400 font-bold uppercase text-xs mt-2 tracking-widest">
                    Books Completed
                  </p>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-50">
                  <div
                    className="bg-blue-600 h-full transition-all duration-700 ease-out shadow-inner"
                    style={{ width: `${calculatePercentage()}%` }}
                  ></div>
                </div>

                <p className="text-xl font-black text-blue-800">
                  {Math.round(calculatePercentage())}%
                </p>

                {progress.is_completed && (
                  <div className="bg-green-500 text-white p-4 rounded-2xl font-black uppercase tracking-widest animate-bounce">
                    Target Reached! 🏆
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 italic">
                No goal set for {year}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReadingGoals;
