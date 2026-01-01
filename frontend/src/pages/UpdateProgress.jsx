import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Activity, ChevronLeft } from "lucide-react";

function UpdateProgress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [formData, setFormData] = useState({
    current_page: "",
    status: "Want to Read",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const bookRes = await api.get(`/books/${id}`);
        setBook(bookRes.data);

        const progressRes = await api.get(`/books/${id}/progress`);
        if (progressRes.data) {
          setFormData({
            current_page: progressRes.data.current_page,
            status: progressRes.data.status || "Want to Read",
          });
        }
      } catch (err) {
        console.log("No progress record exists yet.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus === "Want to Read") {
      setFormData({ ...formData, status: newStatus, current_page: 0 });
    } else if (newStatus === "Finished" && book) {
      setFormData({
        ...formData,
        status: newStatus,
        current_page: book.total_pages,
      });
    } else {
      setFormData({ ...formData, status: newStatus });
    }
  };

  const handlePageChange = (e) => {
    const val = e.target.value;

    if (val === "") {
      setFormData({ ...formData, current_page: "" });
      return;
    }

    const numVal = parseInt(val);

    if (book && numVal >= book.total_pages) {
      setFormData({
        ...formData,
        current_page: book.total_pages,
        status: "Finished",
      });
    } else {
      setFormData({ ...formData, current_page: numVal });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!book) return;

    const pageToSend =
      formData.current_page === "" ? 0 : parseInt(formData.current_page);

    if (
      formData.status === "Currently Reading" &&
      pageToSend === book.total_pages
    ) {
      setError("If you are on the last page, please set status to 'Finished'.");
      return;
    }

    if (pageToSend > book.total_pages) {
      setError(`Wait! This book only has ${book.total_pages} pages.`);
      return;
    }

    try {
      await api.put(`/books/${id}/progress`, {
        current_page: pageToSend,
        status: formData.status,
      });
      alert("Progress updated!");
      navigate("/books");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update progress.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
        <header className="mb-12">
          <button
            onClick={() => navigate("/books")}
            className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest mb-4 hover:underline"
          >
            <ChevronLeft size={16} /> Back to Library
          </button>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
            Update Progress
          </h1>
          <p className="mt-2 text-slate-500 text-lg font-medium italic">
            "{book?.title}"
          </p>
        </header>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
              Reading Activity
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-2xl text-red-700 font-bold text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Current Status
                </label>
                <select
                  value={formData.status}
                  onChange={handleStatusChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                >
                  <option value="Want to Read">🕒 Want to Read</option>
                  <option value="Currently Reading">
                    📖 Currently Reading
                  </option>
                  <option value="Finished">✅ Finished</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Current Page / {book?.total_pages}
                </label>
                <input
                  type="number"
                  value={formData.current_page}
                  onChange={handlePageChange}
                  disabled={formData.status === "Want to Read"}
                  placeholder="Enter page number..."
                  className={`w-full px-6 py-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold ${
                    formData.status === "Want to Read"
                      ? "bg-slate-100 text-slate-300"
                      : "bg-slate-50 text-slate-700"
                  }`}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
              <div className="flex justify-between items-end px-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Live Preview
                </p>
                <p className="text-lg font-black text-blue-600">
                  {Math.round(
                    ((formData.current_page || 0) / (book?.total_pages || 1)) *
                      100
                  )}
                  %
                </p>
              </div>
              <div className="h-3 w-full bg-white rounded-full overflow-hidden shadow-inner">
                <div
                  style={{
                    width: `${
                      ((formData.current_page || 0) /
                        (book?.total_pages || 1)) *
                      100
                    }%`,
                  }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500 shadow-lg"
                ></div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-slate-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl transition shadow-xl active:scale-95"
              >
                Save Progress
              </button>
              <button
                type="button"
                onClick={() => navigate("/books")}
                className="px-10 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UpdateProgress;
