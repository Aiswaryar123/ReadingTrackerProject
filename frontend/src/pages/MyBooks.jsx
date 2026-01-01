import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  Search,
  Plus,
  Trash2,
  Pencil,
  Star,
  Activity,
  BookOpen,
  RefreshCcw,
} from "lucide-react";

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError("Unable to sync your library. Please try again.");
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    try {
      if (value.trim() === "") {
        fetchBooks();
        return;
      }
      const response = await api.get(`/books/search?q=${value}`);
      setBooks(response.data.data || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this book?")) {
      try {
        await api.delete(`/books/${id}`);
        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        alert("Failed to delete the book.");
      }
    }
  };

  const StatusBadge = ({ progress, totalPages }) => {
    const status = progress?.status || "Want to Read";
    const currentPage = progress?.current_page || 0;
    const percentage = Math.round((currentPage / totalPages) * 100) || 0;

    const styles = {
      Finished: "bg-emerald-50 text-emerald-600 border-emerald-100",
      Reading: "bg-indigo-50 text-indigo-600 border-indigo-100",
      "Currently Reading": "bg-indigo-50 text-indigo-600 border-indigo-100",
      Default: "bg-slate-50 text-slate-400 border-slate-100",
    };

    const currentStyle = styles[status] || styles.Default;

    return (
      <div className="space-y-4">
        <span
          className={`${currentStyle} border text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg inline-block`}
        >
          {status}
        </span>
        <div className="space-y-2">
          <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>
              Page {currentPage} / {totalPages}
            </span>
            <span className="text-slate-800">{percentage}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              style={{ width: `${percentage}%` }}
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700 shadow-sm"
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-6xl mx-auto py-12 px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              My Library
            </h1>
            <p className="text-slate-500 mt-4 text-lg font-medium">
              Manage your collection of books
            </p>
          </div>
          <button
            onClick={() => navigate("/add-book")}
            className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-widest px-8 py-5 rounded-2xl shadow-xl transition-all active:scale-95 group"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            Add New Book
          </button>
        </div>

        <div className="mb-12 relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
            <Search size={22} />
          </div>
          <input
            type="text"
            placeholder="Lookup by book name..."
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full pl-16 pr-6 py-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-slate-600 placeholder-slate-300 text-lg"
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-5 mb-10 rounded-r-2xl shadow-sm text-red-700 font-bold flex items-center gap-3">
            <span>⚠️</span> {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <RefreshCcw className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
              Syncing Shelf...
            </p>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm border-dashed">
            <BookOpen size={80} className="mx-auto mb-6 text-slate-200" />
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
              No Titles Found
            </h2>
            <p className="text-slate-400 mt-2 mb-10 font-medium italic text-lg">
              {searchQuery
                ? `No matches for "${searchQuery}"`
                : "Your library is currently empty."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                fetchBooks();
              }}
              className="bg-slate-50 text-blue-600 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-blue-100 transition-all"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-slate-50 rounded-full opacity-50 group-hover:bg-blue-50 transition-colors"></div>

                <div className="flex justify-between items-center mb-6 relative z-10">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] px-3 py-1.5 bg-blue-50 rounded-lg">
                    {book.genre || "General"}
                  </span>
                  <span className="text-xs font-bold text-slate-300 tracking-tighter uppercase">
                    {book.publication_year || "---"} Release
                  </span>
                </div>

                <div className="mb-10 relative z-10">
                  <h3 className="text-3xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-indigo-500 font-bold text-sm mt-3 uppercase tracking-widest">
                    by {book.author}
                  </p>
                </div>

                <div className="flex-grow">
                  <StatusBadge
                    progress={book.progress}
                    totalPages={book.total_pages}
                  />
                </div>

                <div className="mt-12 flex items-center gap-3 relative z-10">
                  <button
                    onClick={() => navigate(`/books/${book.id}/progress`)}
                    className="flex-[4] flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-5 rounded-2xl transition shadow-xl active:scale-95"
                  >
                    <Activity size={16} />
                    Track
                  </button>

                  <button
                    onClick={() => navigate(`/books/${book.id}/review`)}
                    className="flex-[2] flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest py-5 rounded-2xl transition active:scale-95"
                    title="Write Review"
                  >
                    <Star size={18} fill="currentColor" />
                  </button>

                  <button
                    onClick={() => navigate(`/books/${book.id}/edit`)}
                    className="flex-1 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 py-5 rounded-2xl transition active:scale-95"
                    title="Edit Details"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(book.id)}
                    className="flex-1 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-500 py-5 rounded-2xl transition active:scale-95"
                    title="Delete Title"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyBooks;
