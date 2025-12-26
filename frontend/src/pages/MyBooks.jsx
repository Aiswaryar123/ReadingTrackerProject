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
      const response = await api.get("/api/books");

      setBooks(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch books. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this book?")) {
      try {
        await api.delete(`/api/books/${id}`);

        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        alert("Failed to delete the book.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
          <button
            onClick={() => navigate("/add-book")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            + Add New Book
          </button>
        </div>

        {error && (
          <p className="text-red-500 bg-red-50 p-4 rounded-lg mb-6">{error}</p>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading your books...</p>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">Your library is empty.</p>
            <button
              onClick={() => navigate("/add-book")}
              className="text-blue-600 font-semibold"
            >
              Add your first book now →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 italic">by {book.author}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-bold uppercase">
                    {book.total_pages} Pages
                  </span>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate(`/books/${book.id}/progress`)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Update Progress
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                    title="Delete Book"
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
