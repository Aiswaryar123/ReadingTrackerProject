import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Review() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ rating: 5, comment: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/books/${id}/reviews`);

      if (response.data && response.data.data) {
        setReviews(response.data.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("No reviews found yet.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/books/${id}/reviews`, {
        rating: parseInt(formData.rating),
        comment: formData.comment,
      });

      alert("Review submitted successfully!");

      fetchReviews();

      setFormData({ rating: 5, comment: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add review.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-20 font-bold text-gray-400">
        Loading reviews...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-fit">
            {reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <header className="mb-6">
                  <span className="text-4xl">⭐</span>
                  <h2 className="text-2xl font-black text-gray-800 mt-2 uppercase tracking-tighter">
                    Rate Book
                  </h2>
                  <p className="text-gray-400 text-sm">
                    How was your reading experience?
                  </p>
                </header>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Select Rating
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({ ...formData, rating: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition bg-white"
                    >
                      <option value="5">5 Stars - Amazing</option>
                      <option value="4">4 Stars - Very Good</option>
                      <option value="3">3 Stars - Average</option>
                      <option value="2">2 Stars - Poor</option>
                      <option value="1">1 Star - Terrible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Review Comment
                    </label>
                    <textarea
                      rows="5"
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      placeholder="Write your thoughts here..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition active:scale-95 uppercase tracking-widest text-xs"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-blue-50 border-2 border-blue-100 p-10 rounded-[2.5rem] text-center">
                <span className="text-5xl">✅</span>
                <h3 className="text-xl font-black text-blue-900 mt-4 uppercase tracking-tighter text-sans">
                  Completed
                </h3>
                <p className="text-blue-600 mt-2 text-sm font-medium">
                  Your review has been recorded. Thank you for your feedback!
                </p>
                <button
                  onClick={() => navigate("/books")}
                  className="mt-6 text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
                >
                  Back to Library
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-widest">
              Reader Feedback
            </h2>

            {reviews.length === 0 ? (
              <div className="bg-white p-10 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                <p className="text-gray-400 italic">
                  No reviews yet. Be the first to rate this book!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                  >
                    <div className="flex text-yellow-400 text-lg mb-3">
                      {"★".repeat(rev.rating)}
                      {"☆".repeat(5 - rev.rating)}
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium italic">
                      "{rev.comment}"
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        Your Review
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Review;
