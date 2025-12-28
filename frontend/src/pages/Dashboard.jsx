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
        const response = await api.get("/api/dashboard");
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
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Your reading journey at a glance.
            </p>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!stats && !error && (
          <div className="flex items-center justify-center h-40 italic text-gray-500">
            Loading stats...
          </div>
        )}

        {stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Total Books
                </p>
                <p className="mt-2 text-4xl font-black text-blue-600">
                  {stats.total_books}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Reading
                </p>
                <p className="mt-2 text-4xl font-black text-purple-600">
                  {stats.currently_reading}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Finished
                </p>
                <p className="mt-2 text-4xl font-black text-green-600">
                  {stats.books_finished}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Avg Rating
                </p>
                <p className="mt-2 text-4xl font-black text-yellow-500">
                  {stats.average_rating}{" "}
                  <span className="text-2xl text-yellow-300">⭐</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    2025 Reading Goal
                  </h2>
                  <p className="text-gray-500">
                    {stats.goal_target > 0
                      ? `You have finished ${stats.books_finished} out of ${stats.goal_target} books.`
                      : "No goal set for this year yet."}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/goals")}
                  className="text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                >
                  {stats.goal_target > 0 ? "Edit Goal" : "Set Goal"}
                </button>
              </div>

              <div className="relative h-6 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                <div
                  style={{ width: `${calculateProgress()}%` }}
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-inner shadow-blue-400"
                ></div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400 uppercase">
                  Progress
                </span>
                <span className="text-xl font-black text-blue-600">
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
