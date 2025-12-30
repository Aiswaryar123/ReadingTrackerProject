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
      setError("Unable to load your library. Please try again later.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this book from your collection?"
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

  const renderStatusInfo = (book) => {
    const status = book.progress?.status || "Want to Read";
    const currentPage = book.progress?.current_page || 0;
    const totalPages = book.total_pages;
    const percentage = Math.round((currentPage / totalPages) * 100) || 0;

    return (
      <div className="space-y-5">
        <div>
          {status === "Finished" ? (
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl">
              Completed
            </span>
          ) : status === "Currently Reading" || status === "Reading" ? (
            <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl">
              Reading Now
            </span>
          ) : (
            <span className="bg-slate-50 text-slate-400 border border-slate-100 text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl">
              On Deck
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Page {currentPage} <span className="text-slate-200">/</span>{" "}
              {totalPages}
            </p>
            <p className="text-sm font-black text-slate-800">{percentage}%</p>
          </div>

          <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${percentage}%` }}
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700 ease-out"
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
              My Library
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              You have{" "}
              <span className="text-blue-600 font-bold">{books.length}</span>{" "}
              titles in your collection.
            </p>
          </div>
          <button
            onClick={() => navigate("/add-book")}
            className="bg-slate-900  text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95"
          >
            + Add New Book
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-10 rounded-r-xl">
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">
              Syncing Library...
            </p>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm border-dashed">
            <div className="text-6xl mb-6 opacity-20">📚</div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
              Your Shelf is Empty
            </h2>
            <p className="text-slate-500 mt-2 mb-8">
              Start your journey by adding your first book.
            </p>
            <button
              onClick={() => navigate("/add-book")}
              className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
            >
              Add a book manually →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-indigo-500 font-bold text-sm mt-1 uppercase tracking-wider">
                    {book.author}
                  </p>
                </div>

                <div className="flex-grow">{renderStatusInfo(book)}</div>

                <div className="mt-10 flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/books/${book.id}/progress`)}
                    className="flex-[2] bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl transition shadow-lg active:scale-95"
                  >
                    Track
                  </button>

                  <button
                    onClick={() => navigate(`/books/${book.id}/review`)}
                    className="flex-[2] bg-amber-50 hover:bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl transition active:scale-95"
                  >
                    Review
                  </button>

                  <button
                    onClick={() => handleDelete(book.id)}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-500 py-4 rounded-2xl transition flex justify-center items-center active:scale-95"
                    title="Delete Book"
                  >
                    <span className="text-lg">🗑️</span>
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
