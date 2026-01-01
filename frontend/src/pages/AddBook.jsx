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

  const validateForm = () => {
    const { title, author, total_pages, publication_year } = formData;
    const currentYear = new Date().getFullYear(); // This will be 2026

    if (title.trim().length < 2) return "Book title is too short.";
    if (/^\d+$/.test(title)) return "Title cannot be only numbers.";

    if (author.trim().length < 2) return "Author name is too short.";

    const pages = parseInt(total_pages);
    if (isNaN(pages) || pages <= 0)
      return "Total pages must be greater than 0.";

    if (publication_year) {
      const year = parseInt(publication_year);
      // Logic: Between year 1000 and 2026
      if (year < 1000 || year > currentYear) {
        return `Publication year must be between 1000 and ${currentYear}.`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Frontend validation for 2026
    const currentYear = 2026;
    if (parseInt(formData.total_pages) <= 0) {
      setError("Total pages must be greater than 0.");
      return;
    }
    if (formData.publication_year) {
      const year = parseInt(formData.publication_year);
      if (year < 1000 || year > currentYear) {
        setError(`Publication year must be between 1000 and ${currentYear}.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await api.post("/books", {
        ...formData,
        publication_year: parseInt(formData.publication_year) || 0,
        total_pages: parseInt(formData.total_pages) || 0,
      });

      alert("Book added successfully!");
      navigate("/books");
    } catch (err) {
      // 2. Logic: Extract the specific "error" field from the Backend JSON
      // If backend sends {"error": "this book already exists"}, serverMessage becomes that string.
      const serverMessage =
        err.response?.data?.error || "Failed to save book. Please try again.";
      setError(serverMessage);
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
            Registering a new title for the year {new Date().getFullYear()}.
          </p>
        </header>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-slate-50 rounded-full opacity-50 flex items-center justify-center pt-8 pl-4">
            <span className="text-6xl grayscale opacity-10 font-bold italic">
              2026
            </span>
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
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-2xl shadow-sm animate-bounce">
                <p className="text-red-700 font-bold text-sm">⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                  placeholder="e.g. Mathilukal"
                />
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
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                    placeholder="Basheer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    ISBN Code
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                    placeholder="Unique ID"
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
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                    placeholder="Classic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Year (1000-2026)
                  </label>
                  <input
                    type="number"
                    name="publication_year"
                    value={formData.publication_year}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                    placeholder="2026"
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
                    value={formData.total_pages}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                    placeholder="300"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-900 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Checking Database..." : "Add to Library"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/books")}
                  className="px-10 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition"
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
