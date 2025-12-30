import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function MyBooks() {
  const [books, setBooks] = useState([]);
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

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this book? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/books/${id}`);
        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        alert("Failed to delete the book.");
      }
    }
  };

  const renderProgressSection = (book) => {
    const status = book.progress?.status || "Want to Read";
    const currentPage = book.progress?.current_page || 0;
    const totalPages = book.total_pages;
    const percentage = Math.round((currentPage / totalPages) * 100) || 0;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {status === "Finished" ? (
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg">
              Completed
            </span>
          ) : status === "Currently Reading" || status === "Reading" ? (
            <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg">
              Reading Now
            </span>
          ) : (
            <span className="bg-slate-50 text-slate-400 border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg">
              On Deck
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Progress: {currentPage} / {totalPages} Pgs
            </p>
            <p className="text-xs font-black text-slate-800">{percentage}%</p>
          </div>
          <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${percentage}%` }}
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-sm"
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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              My Library
            </h1>
            <p className="text-slate-500 mt-4 text-lg font-medium">
              Manage your curated collection of Books
            </p>
          </div>
          <button
            onClick={() => navigate("/add-book")}
            className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-widest px-10 py-5 rounded-[1.5rem] shadow-2xl transition-all active:scale-95"
          >
            + Add New Title
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-10 rounded-r-2xl">
            <p className="text-red-700 font-bold">⚠️ {error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
              Syncing Shelf...
            </p>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm border-dashed">
            <div className="text-7xl mb-6 opacity-10 grayscale">📚</div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
              Your Library is Quiet
            </h2>
            <p className="text-slate-400 mt-2 mb-10 font-medium italic text-lg text-sans">
              No books found in your collection.
            </p>
            <button
              onClick={() => navigate("/add-book")}
              className="bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-blue-100 transition-all"
            >
              Start Your Catalog Today
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-slate-50 rounded-full opacity-50 group-hover:bg-blue-50 transition-colors"></div>

                <div className="flex justify-between items-center mb-6 relative z-10">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] px-3 py-1.5 bg-blue-50 rounded-lg">
                    {book.genre || "General"}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {book.publication_year || "---"}
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

                <div className="flex-grow">{renderProgressSection(book)}</div>

                <div className="mt-12 flex items-center gap-4 relative z-10">
                  <button
                    onClick={() => navigate(`/books/${book.id}/progress`)}
                    className="flex-[4] bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-5 rounded-2xl transition shadow-xl active:scale-95"
                  >
                    Track Progress
                  </button>

                  <button
                    onClick={() => navigate(`/books/${book.id}/review`)}
                    className="flex-[2] bg-amber-50 hover:bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest py-5 rounded-2xl transition active:scale-95 flex justify-center"
                    title="Write Review"
                  >
                    ⭐
                  </button>

                  <button
                    onClick={() => navigate(`/books/${book.id}/edit`)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 py-5 rounded-2xl transition active:scale-95 flex justify-center"
                    title="Edit Details"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(book.id)}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-400 hover:text-rose-600 py-5 rounded-2xl transition active:scale-95 flex justify-center"
                    title="Delete Title"
                  >
                    🗑️
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
