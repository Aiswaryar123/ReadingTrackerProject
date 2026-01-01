import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  Star,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  Users,
  User,
} from "lucide-react";

function Review() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, comment: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/books/${id}/reviews`);
      const allReviews = response.data.data || [];
      setReviews(allReviews);

      const userReviewExists = allReviews.some(
        (rev) => rev.book_id === parseInt(id)
      );
      setHasUserReviewed(userReviewExists);
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
      alert("Your review has been shared with the community!");
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to submit review.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold uppercase text-xs tracking-widest animate-pulse">
          Fetching Community Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-6 lg:px-8">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
              Reader Reviews
            </h1>
            <p className="mt-2 text-slate-500 text-lg font-medium">
              Explore thoughts from the Bookshelf community.
            </p>
          </div>
          <button
            onClick={() => navigate("/books")}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Library
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-fit">
            {!hasUserReviewed ? (
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                    Write your Review
                  </h2>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 flex items-center gap-2 border border-red-100">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                      Rating
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({ ...formData, rating: e.target.value })
                      }
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Very Good</option>
                      <option value="3">⭐⭐⭐ Average</option>
                      <option value="2">⭐⭐ Poor</option>
                      <option value="1">⭐ Terrible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                      Comments
                    </label>
                    <textarea
                      rows="5"
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      placeholder="What did you love about this book?"
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-slate-700"
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
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6 text-emerald-500">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                  Your Review is live
                </h3>
                <p className="text-slate-500 font-medium mt-3 px-4 leading-relaxed">
                  You have successfully contributed to the community feedback
                  for this title.
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
            <div className="flex items-center justify-between mb-4 ml-2">
              <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                Recent Reader Feedback
              </h2>
              <div className="flex items-center gap-1 text-blue-500 font-bold text-[10px] uppercase tracking-widest">
                <Users size={14} /> {reviews.length} Total
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center flex flex-col items-center">
                <Star size={48} className="text-slate-100 mb-4" />
                <p className="text-slate-400 font-medium italic">
                  No reviews match this ISBN yet.
                </p>
                <p className="text-slate-300 text-[10px] mt-2 uppercase font-bold tracking-widest">
                  Be the first to rate it
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 relative group transition-all hover:shadow-md"
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex text-yellow-400 text-lg tracking-tighter">
                          {"★".repeat(rev.rating)}
                          <span className="text-slate-100 italic">
                            {"★".repeat(5 - rev.rating)}
                          </span>
                        </div>
                        {rev.book_id === parseInt(id) && (
                          <span className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase px-2 py-1 rounded-md">
                            My Review
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 leading-relaxed font-serif text-lg italic">
                        "{rev.comment}"
                      </p>

                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-black text-blue-600 uppercase">
                            {rev.book?.user?.name
                              ? rev.book.user.name.charAt(0)
                              : "U"}
                          </div>
                          <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                            {rev.book?.user?.name || "Verified Reader"}
                          </span>
                        </div>

                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                          {new Date(rev.created_at).toLocaleDateString()}
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
