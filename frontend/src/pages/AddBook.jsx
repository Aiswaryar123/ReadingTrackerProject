import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publication_year: "",
    total_pages: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await api.post("/books", {
        ...formData,
        publication_year: parseInt(formData.publication_year) || 0,
        total_pages: parseInt(formData.total_pages) || 0,
      });

      alert("Book added successfully to your library!");
      navigate("/books");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to save book. Please check your data."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
            Expand Library
          </h1>
          <p className="mt-2 text-slate-500 text-lg font-medium">
            Fill in the metadata to catalog a new title in your digital
            bookshelf.
          </p>
        </header>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-slate-50 rounded-full opacity-50 flex items-center justify-center pt-8 pl-4">
            <span className="text-6xl grayscale opacity-10">📖</span>
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                Book Metadata
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-2xl shadow-sm">
                <p className="text-red-700 font-bold text-sm">⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700 placeholder-slate-300"
                    placeholder="e.g. The Great Gatsby"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    required
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700 placeholder-slate-300"
                    placeholder="F. Scott Fitzgerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    ISBN Code
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700 placeholder-slate-300"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Genre
                  </label>
                  <input
                    type="text"
                    name="genre"
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700 placeholder-slate-300"
                    placeholder="Fiction"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Published Year
                  </label>
                  <input
                    type="number"
                    name="publication_year"
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700 placeholder-slate-300"
                    placeholder="1925"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Total Pages *
                  </label>
                  <input
                    type="number"
                    name="total_pages"
                    required
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700 placeholder-slate-300"
                    placeholder="180"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Add to Library"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/books")}
                  className="w-full sm:w-auto px-10 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition duration-300"
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

export default AddBook;
