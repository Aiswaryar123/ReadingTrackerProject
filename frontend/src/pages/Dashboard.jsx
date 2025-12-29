import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard");
        setStats(response.data);
      } catch (err) {
        setError(
          "Unable to reach the server. Please ensure the backend is active."
        );
      }
    };
    fetchStats();
  }, []);

  const calculateProgress = () => {
    if (!stats || stats.goal_target === 0) return 0;
    const percentage = (stats.books_finished / stats.goal_target) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {" "}
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Reading Dashboard
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            Track your progress, manage your goals, and celebrate your reading
            milestones.
          </p>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-10 rounded-r-xl shadow-sm">
            <div className="flex items-center">
              <span className="text-red-500 mr-3">⚠️</span>
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {!stats && !error && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse text-sm uppercase tracking-widest">
              Syncing your library...
            </p>
          </div>
        )}

        {stats && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">
                    <svg
                      className="w-6 h-6 text-blue-600 group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Total Books
                </p>
                <p className="text-5xl font-black text-slate-800 mt-1">
                  {stats.total_books}
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 transition-colors duration-300">
                    <svg
                      className="w-6 h-6 text-indigo-600 group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Active Reads
                </p>
                <p className="text-5xl font-black text-slate-800 mt-1">
                  {stats.currently_reading}
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-600 transition-colors duration-300">
                    <svg
                      className="w-6 h-6 text-emerald-600 group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Completed
                </p>
                <p className="text-5xl font-black text-slate-800 mt-1">
                  {stats.books_finished}
                </p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-slate-50 rounded-full opacity-50"></div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                      2025 Reading Challenge
                    </h2>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                      <p className="text-slate-500 font-medium">
                        {stats.goal_target > 0
                          ? `Progress: ${stats.books_finished} of ${stats.goal_target} books finished`
                          : "No reading goal set for this year."}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/goals")}
                    className="bg-slate-900 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                  >
                    {stats.goal_target > 0
                      ? "Edit Challenge"
                      : "Start Challenge"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">
                      Target Mastery
                    </span>
                    <span className="text-3xl font-black text-blue-600">
                      {Math.round(calculateProgress())}%
                    </span>
                  </div>
                  <div className="relative h-5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${calculateProgress()}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    ></div>
                  </div>

                  <div className="flex justify-between px-1">
                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                      Beginner
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                      Halfway
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                      Finisher
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
