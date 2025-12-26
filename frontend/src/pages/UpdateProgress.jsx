import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function UpdateProgress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    current_page: 0,
    status: "Want to Read",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentProgress = async () => {
      try {
        const response = await api.get(`/api/books/${id}/progress`);
        if (response.data) {
          setFormData({
            current_page: response.data.current_page,
            status: response.data.status,
          });
        }
      } catch (err) {
        console.log("No existing progress found, starting fresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentProgress();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/books/${id}/progress`, {
        current_page: parseInt(formData.current_page),
        status: formData.status,
      });
      alert("Progress updated!");
      navigate("/books");
    } catch (err) {
      setError("Failed to update progress.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📉 Update Progress
          </h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reading Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Want to Read">Want to Read</option>
                <option value="Currently Reading">Currently Reading</option>
                <option value="Finished">Finished</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Page Number
              </label>
              <input
                type="number"
                value={formData.current_page}
                onChange={(e) =>
                  setFormData({ ...formData, current_page: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                min="0"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
              >
                Save Progress
              </button>
              <button
                type="button"
                onClick={() => navigate("/books")}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UpdateProgress;
