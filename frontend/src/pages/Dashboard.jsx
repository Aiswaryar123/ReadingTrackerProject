import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Activity,
  CheckCircle,
  Trophy,
  CalendarDays,
  Target,
} from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard");
        setStats(response.data);
      } catch (err) {
        setError("Connection error. Please check if backend is running.");
      }
    };
    fetchStats();
  }, []);

  const calculatePct = (cur, tar) =>
    tar > 0 ? Math.min(Math.round((cur / tar) * 100), 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Overview
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Your reading performance for {currentMonthName} {currentYear}.
          </p>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-10 rounded-r-xl shadow-sm">
            <p className="text-red-700 font-bold">⚠️ {error}</p>
          </div>
        )}

        {!stats && !error && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 text-slate-400">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="font-black text-[10px] uppercase tracking-widest animate-pulse">
              Syncing Stats...
            </p>
          </div>
        )}

        {stats && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition hover:shadow-lg group">
                <div className="p-3 bg-blue-50 w-fit rounded-2xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BookOpen size={20} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  Total Books
                </p>
                <p className="text-5xl font-black text-slate-800 tracking-tighter">
                  {stats.total_books}
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition hover:shadow-lg group">
                <div className="p-3 bg-indigo-50 w-fit rounded-2xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Activity size={20} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  Reading Now
                </p>
                <p className="text-5xl font-black text-slate-800 tracking-tighter">
                  {stats.currently_reading}
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition hover:shadow-lg group">
                <div className="p-3 bg-emerald-50 w-fit rounded-2xl mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <CheckCircle size={20} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  Yearly Books
                </p>
                <p className="text-5xl font-black text-slate-800 tracking-tighter">
                  {stats.books_finished}
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition hover:shadow-lg group">
                <div className="p-3 bg-orange-50 w-fit rounded-2xl mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Target size={20} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  Months Set
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-5xl font-black text-slate-800 tracking-tighter">
                    {stats.goals_set_count}
                  </p>
                  <p className="text-xl font-black text-slate-200">/ 12</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                        <CalendarDays size={20} />
                      </div>
                      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                        {currentMonthName} Status
                      </h2>
                    </div>
                    <span className="text-2xl font-black text-purple-600">
                      {calculatePct(
                        stats.monthly_finished,
                        stats.monthly_target
                      )}
                      %
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${calculatePct(
                            stats.monthly_finished,
                            stats.monthly_target
                          )}%`,
                        }}
                        className="h-full bg-purple-600 transition-all duration-1000 shadow-lg"
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                        {stats.monthly_finished} of {stats.monthly_target} books
                        read
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Trophy size={20} />
                      </div>
                      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                        {currentYear} Marathon
                      </h2>
                    </div>
                    <span className="text-2xl font-black text-blue-600">
                      {calculatePct(stats.books_finished, stats.yearly_target)}%
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${calculatePct(
                            stats.books_finished,
                            stats.yearly_target
                          )}%`,
                        }}
                        className="h-full bg-blue-600 transition-all duration-1000 shadow-lg"
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                        {stats.books_finished} of {stats.yearly_target} books
                        read
                      </p>
                      <button
                        onClick={() => navigate("/goals")}
                        className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
                      >
                        Edit Goals →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
