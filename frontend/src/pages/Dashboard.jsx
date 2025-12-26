import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome Back!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Here is a summary of your reading journey.
          </p>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!stats && !error && (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500">Fetching your data...</span>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
              <div className="p-5">
                <p className="text-sm font-medium text-gray-500 truncate uppercase">
                  Total Books
                </p>
                <p className="mt-1 text-3xl font-bold text-blue-600">
                  {stats.total_books}
                </p>
              </div>
              <div className="bg-blue-50 px-5 py-2">
                <span className="text-xs text-blue-700 font-medium">
                  In your library
                </span>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
              <div className="p-5">
                <p className="text-sm font-medium text-gray-500 truncate uppercase">
                  Reading Now
                </p>
                <p className="mt-1 text-3xl font-bold text-purple-600">
                  {stats.currently_reading}
                </p>
              </div>
              <div className="bg-purple-50 px-5 py-2">
                <span className="text-xs text-purple-700 font-medium">
                  Active books
                </span>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
              <div className="p-5">
                <p className="text-sm font-medium text-gray-500 truncate uppercase">
                  Books Finished
                </p>
                <p className="mt-1 text-3xl font-bold text-green-600">
                  {stats.books_finished}
                </p>
              </div>
              <div className="bg-green-50 px-5 py-2">
                <span className="text-xs text-green-700 font-medium">
                  Great job!
                </span>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
              <div className="p-5">
                <p className="text-sm font-medium text-gray-500 truncate uppercase">
                  Average Rating
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="mt-1 text-3xl font-bold text-yellow-500">
                    {stats.average_rating}
                  </p>
                  <span className="text-lg">⭐</span>
                </div>
              </div>
              <div className="bg-yellow-50 px-5 py-2">
                <span className="text-xs text-yellow-700 font-medium">
                  User score
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
