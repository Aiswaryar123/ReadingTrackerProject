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
      setError("Failed to fetch books.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this book from your library?")) {
      try {
        await api.delete(`/books/${id}`);
        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const renderStatusInfo = (book) => {
    const status = book.progress?.status || "Want to Read";
    const currentPage = book.progress?.current_page || 0;
    const totalPages = book.total_pages;

    return (
      <div className="space-y-3">
        <div>
          {status === "Finished" ? (
            <span className="bg-green-100 text-green-700 border border-green-200 text-[10px] uppercase font-black px-2 py-1 rounded">
              Finished
            </span>
          ) : status === "Currently Reading" || status === "Reading" ? (
            <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[10px] uppercase font-black px-2 py-1 rounded">
              Currently Reading
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-500 border border-gray-200 text-[10px] uppercase font-black px-2 py-1 rounded">
              Want to Read
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <span>{Math.round((currentPage / totalPages) * 100)}%</span>
          </div>

          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              My Collection
            </h1>
            <p className="text-gray-500 text-sm">
              You have {books.length} books in your library.
            </p>
          </div>
          <button
            onClick={() => navigate("/add-book")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 transition active:scale-95"
          >
            + Add Book
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse font-bold">
            Loading your shelf...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 leading-tight mb-1">
                      {book.title}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm">
                      {book.author}
                    </p>
                  </div>
                </div>

                <div className="mb-8">{renderStatusInfo(book)}</div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => navigate(`/books/${book.id}/progress`)}
                    className="flex-1 bg-gray-900 hover:bg-black text-white text-xs py-3 rounded-xl font-bold transition"
                  >
                    Track
                  </button>
                  <button
                    onClick={() => navigate(`/books/${book.id}/review`)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xs py-3 rounded-xl font-bold transition"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl transition"
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
