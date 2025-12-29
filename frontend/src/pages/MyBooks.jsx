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
    if (window.confirm("Delete this book?")) {
      try {
        await api.delete(`/books/${id}`);
        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const renderStatusBadge = (progress) => {
    const status = progress?.status || "Want to Read";

    if (status === "Finished") {
      return (
        <span className="bg-green-100 text-green-700 border border-green-200 text-[10px] uppercase font-black px-2 py-1 rounded">
          Finished
        </span>
      );
    }

    if (status === "Currently Reading" || status === "Reading") {
      return (
        <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[10px] uppercase font-black px-2 py-1 rounded">
          Currently Reading
        </span>
      );
    }

    return (
      <span className="bg-gray-100 text-gray-500 border border-gray-200 text-[10px] uppercase font-black px-2 py-1 rounded">
        Want to Read
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Bookshelf</h1>
          <button
            onClick={() => navigate("/add-book")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold"
          >
            + Add Book
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading library...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {book.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{book.author}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    {book.total_pages} Pgs
                  </span>
                </div>

                <div className="mt-2 mb-6">
                  {renderStatusBadge(book.progress)}
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => navigate(`/books/${book.id}/progress`)}
                    className="flex-1 bg-gray-900 text-white text-xs py-2.5 rounded-lg font-bold"
                  >
                    Track
                  </button>
                  <button
                    onClick={() => navigate(`/books/${book.id}/review`)}
                    className="flex-1 bg-yellow-400 text-yellow-900 text-xs py-2.5 rounded-lg font-bold"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-50 text-red-600 p-2.5 rounded-lg"
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
