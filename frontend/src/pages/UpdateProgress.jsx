import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function UpdateProgress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [formData, setFormData] = useState({
    current_page: 0,
    status: "Want to Read",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const bookRes = await api.get(`/api/books/${id}`);
        setBook(bookRes.data);

        const progressRes = await api.get(`/api/books/${id}/progress`);
        if (progressRes.data) {
          setFormData({
            current_page: progressRes.data.current_page,
            status: progressRes.data.status,
          });
        }
      } catch (err) {
        console.log("Starting fresh progress for this book.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const currentPage = parseInt(formData.current_page);

    if (currentPage > book.total_pages) {
      setError(`Wait! This book only has ${book.total_pages} pages.`);
      return;
    }

    if (formData.status === "Finished" && currentPage < book.total_pages) {
      setError(
        `To mark as Finished, your current page must be ${book.total_pages}.`
      );
      return;
    }

    try {
      await api.put(`/api/books/${id}/progress`, {
        current_page: currentPage,
        status: formData.status,
      });
      alert("Progress updated!");
      navigate("/books");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update progress.");
    }
  };

  if (loading)
    return <div className="flex justify-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <header className="mb-8 text-center">
            <span className="text-4xl">📊</span>
            <h2 className="text-2xl font-black text-gray-800 mt-4 uppercase tracking-tighter">
              Update Progress
            </h2>
            {book && (
              <p className="text-gray-500 text-sm mt-1">
                Updating:{" "}
                <span className="font-bold text-blue-600">{book.title}</span> (
                {book.total_pages} pages)
              </p>
            )}
          </header>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Reading Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="Want to Read">Want to Read</option>
                <option value="Currently Reading">Currently Reading</option>
                <option value="Finished">Finished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                I am on Page...
              </label>
              <input
                type="number"
                value={formData.current_page}
                onChange={(e) =>
                  setFormData({ ...formData, current_page: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                min="0"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg transition active:scale-95 uppercase tracking-widest text-sm"
            >
              Update Bookmark
            </button>

            <button
              type="button"
              onClick={() => navigate("/books")}
              className="w-full text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UpdateProgress;
