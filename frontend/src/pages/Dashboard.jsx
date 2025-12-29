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
          "Failed to connect to the server. Please check if backend is running."
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-sans">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600 font-medium">
              Your reading journey at a glance.
            </p>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        )}

        {!stats && !error && (
          <div className="flex items-center justify-center h-40 italic text-gray-400 animate-pulse font-bold">
            Loading your stats...
          </div>
        )}

        {stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                  Total Books
                </p>
                <p className="text-5xl font-black text-blue-600">
                  {stats.total_books}
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                  Reading Now
                </p>
                <p className="text-5xl font-black text-purple-600">
                  {stats.currently_reading}
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                  Completed
                </p>
                <p className="text-5xl font-black text-green-600">
                  {stats.books_finished}
                </p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                    2025 Reading Goal
                  </h2>
                  <p className="text-gray-500 font-medium mt-1">
                    {stats.goal_target > 0
                      ? `You have finished ${stats.books_finished} out of ${stats.goal_target} books.`
                      : "No target set for 2025 yet."}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/goals")}
                  className="bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-blue-100 transition active:scale-95"
                >
                  {stats.goal_target > 0 ? "Adjust Goal" : "Set Goal"}
                </button>
              </div>

              <div className="relative h-8 w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-50 shadow-inner">
                <div
                  style={{ width: `${calculateProgress()}%` }}
                  className="h-full bg-blue-600 rounded-2xl transition-all duration-1000 ease-out shadow-lg"
                ></div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <span className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">
                  Yearly Progress
                </span>
                <span className="text-2xl font-black text-blue-600">
                  {Math.round(calculateProgress())}%
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
