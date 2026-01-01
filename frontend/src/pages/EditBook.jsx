import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    total_pages: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);

        setFormData({
          title: response.data.title,
          author: response.data.author,
          total_pages: response.data.total_pages,
        });
        setLoading(false);
      } catch (err) {
        setError("Unable to find this book in your collection.");
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await api.put(`/books/${id}`, {
        title: formData.title,
        author: formData.author,

        total_pages: parseInt(formData.total_pages) || 0,
      });

      alert("Book updated successfully!");
      navigate("/books");
    } catch (err) {
      setError("Failed to update book details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold uppercase text-xs tracking-widest animate-pulse">
          Fetching Metadata...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
            Edit Metadata
          </h1>
          <p className="mt-2 text-slate-500 text-lg font-medium">
            Modify the core details for{" "}
            <span className="text-blue-600 font-bold">"{formData.title}"</span>.
          </p>
        </header>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-slate-50 rounded-full opacity-50 flex items-center justify-center pt-6 pl-4">
            <span className="text-5xl grayscale opacity-10">✏️</span>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-10">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter text-sans">
                Core Information
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-2xl shadow-sm">
                <p className="text-red-700 font-bold text-sm">⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                  Book Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  required
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    required
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Total Pages
                  </label>
                  <input
                    type="number"
                    name="total_pages"
                    value={formData.total_pages}
                    required
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 bg-slate-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Apply Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/books")}
                  className="w-full sm:w-auto px-10 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditBook;
