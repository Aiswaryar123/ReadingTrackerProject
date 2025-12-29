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
      alert("Your review has been shared!");
      fetchReviews();
      setFormData({ rating: 5, comment: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Unable to submit review.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold uppercase text-xs tracking-widest">
          Loading Reviews...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Rate this Book
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            Share your thoughts and help others discover their next favorite
            read.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-fit">
            {reviews.length === 0 ? (
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-yellow-50 rounded-2xl">
                    <svg
                      className="w-6 h-6 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                    Your Rating
                  </h2>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-red-100 flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                      Star Rating
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({ ...formData, rating: e.target.value })
                      }
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Very Good</option>
                      <option value="3">⭐⭐⭐ Average</option>
                      <option value="2">⭐⭐ Poor</option>
                      <option value="1">⭐ Terrible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                      Your Review
                    </label>
                    <textarea
                      rows="5"
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      placeholder="What did you think about the writing, the story, or the characters?"
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-700 font-medium"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-xl transition-all active:scale-95"
                  >
                    Post Review
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6">
                  <span className="text-4xl text-emerald-500 font-bold">✓</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                  Review Recorded
                </h3>
                <p className="text-slate-500 font-medium mt-3 px-4 leading-relaxed">
                  Thank you for your feedback! To maintain high data quality,
                  each user is limited to one review per book.
                </p>
                <button
                  onClick={() => navigate("/books")}
                  className="mt-8 text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
                >
                  ← Return to Shelf
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-4 ml-2">
              Recent Feedback
            </h2>

            {reviews.length === 0 ? (
              <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center">
                <div className="text-5xl mb-4 grayscale opacity-20">✍️</div>
                <p className="text-slate-400 font-medium italic">
                  No reader feedback yet.
                </p>
                <p className="text-slate-300 text-[10px] mt-2 uppercase font-bold tracking-widest">
                  Be the first to share your journey
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <span className="text-6xl text-yellow-500 font-black">
                        ★
                      </span>
                    </div>

                    <div className="relative z-10">
                      <div className="flex text-yellow-400 text-xl mb-4 tracking-tighter">
                        {"★".repeat(rev.rating)}
                        <span className="text-slate-100 italic">
                          {"★".repeat(5 - rev.rating)}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-serif text-lg italic">
                        "{rev.comment}"
                      </p>
                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                          Verified Personal Review
                        </span>
                      </div>
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
