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
      setReviews(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/books/${id}/reviews`, {
        rating: parseInt(formData.rating),
        comment: formData.comment,
      });
      alert("Review added!");
      setFormData({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      setError("Failed to add review.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-sans">
              ⭐ Rate this Book
            </h2>
            {error && (
              <p className="text-red-500 mb-4 bg-red-50 p-2 rounded">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Rating (1-5)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none font-sans"
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Good</option>
                  <option value="3">3 Stars - Average</option>
                  <option value="2">2 Stars - Poor</option>
                  <option value="1">1 Star - Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Your Review
                </label>
                <textarea
                  rows="4"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="What did you think of this book?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-sans"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-lg transition shadow-md font-sans"
              >
                Submit Review
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-sans">
              Recent Reviews
            </h2>
            {loading ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500 italic">
                No reviews yet. Be the first!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex text-yellow-500 mb-2">
                      {"⭐".repeat(rev.rating)}
                    </div>
                    <p className="text-gray-700 font-sans">{rev.comment}</p>
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
