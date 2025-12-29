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
      const response = await api.get(`/goals/${year}`);
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
      await api.post("/goals", {
        year: parseInt(year),
        target_books: parseInt(target),
      });
      setMessage("Goal successfully updated!");
      fetchGoalProgress();
    } catch (err) {
      setError("Unable to save goal. Please check your connection.");
    }
  };

  const calculatePercentage = () => {
    if (!progress || progress.target === 0) return 0;
    return Math.min((progress.current / progress.target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Reading Goals
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            Challenge yourself by setting yearly targets and track your
            achievement.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 h-fit">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                Target Settings
              </h2>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                  Select Goal Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y} Reading Goal
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                  How many books?
                </label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  min="1"
                  placeholder="Enter number of books"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 bg-slate-700 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                Set Goal
              </button>

              {message && (
                <div className="flex items-center justify-center space-x-2 text-emerald-600 font-bold text-sm bg-emerald-50 py-3 rounded-xl">
                  <span>✅</span> <span>{message}</span>
                </div>
              )}
              {error && (
                <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-sm bg-red-50 py-3 rounded-xl">
                  <span>⚠️</span> <span>{error}</span>
                </div>
              )}
            </form>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-center text-center">
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-8">
              Live Progress for {year}
            </h2>

            {progress ? (
              <div className="space-y-10">
                <div>
                  <span className="text-8xl font-black text-slate-800 tracking-tighter">
                    {progress.current}
                  </span>
                  <span className="text-3xl font-black text-slate-300 ml-2">
                    / {progress.target}
                  </span>
                  <p className="text-slate-400 font-bold uppercase text-xs mt-4 tracking-widest">
                    Books Completed
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative h-6 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                    <div
                      style={{ width: `${calculatePercentage()}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                    ></div>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
                      {Math.round(calculatePercentage())}% Complete
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 uppercase">
                      Target: {progress.target}
                    </span>
                  </div>
                </div>

                {progress.is_completed && (
                  <div className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-lg shadow-emerald-100">
                    <p className="text-xs font-black uppercase tracking-[0.2em] mb-1">
                      Status
                    </p>
                    <p className="text-xl font-black uppercase tracking-tighter animate-pulse">
                      Goal Reached! 🏆
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20">
                <div className="text-6xl mb-4 opacity-20">🎯</div>
                <p className="text-slate-400 font-medium italic">
                  No target has been set for {year} yet.
                </p>
                <p className="text-slate-300 text-xs mt-2 uppercase tracking-widest">
                  Fill the form to start your journey
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReadingGoals;
