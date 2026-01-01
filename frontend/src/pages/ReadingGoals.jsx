import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Calendar, Target, CheckCircle2 } from "lucide-react";

function ReadingGoals() {
  const date = new Date();
  const currentYear = date.getFullYear();
  const availableYears = [currentYear, currentYear + 1];
  const months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [target, setTarget] = useState(0);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMonthData();
  }, [year, month]);

  const fetchMonthData = async () => {
    try {
      const res = await api.get(`/goals/${year}/${month}`);
      setProgress(res.data);
      setTarget(res.data.target);
    } catch {
      setProgress(null);
      setTarget(0);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post("/goals", {
        year: parseInt(year),
        month: parseInt(month),
        target_books: parseInt(target),
      });
      setMessage("Monthly goal set successfully!");
      fetchMonthData();
    } catch {
      setMessage("Error saving goal.");
    }
  };

  const pct =
    progress?.target > 0
      ? Math.min((progress.current / progress.target) * 100, 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Monthly Goals
          </h1>
          <p className="text-slate-500 text-lg">
            Define your reading target for each specific month.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Target />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">
                Set Monthly Target
              </h2>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="p-4 bg-slate-50 rounded-2xl font-bold outline-none border-none"
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="p-4 bg-slate-50 rounded-2xl font-bold outline-none border-none"
                >
                  {months.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-none outline-none"
                placeholder="Target books..."
              />
              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl hover:bg-blue-600 transition shadow-xl"
              >
                Save Goal
              </button>
              {message && (
                <p className="text-blue-600 text-center font-bold text-sm">
                  {message}
                </p>
              )}
            </form>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-center text-center">
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-10">
              Monthly Progress Bar
            </h2>
            {progress ? (
              <div className="space-y-8">
                <p className="text-7xl font-black text-slate-800 tracking-tighter">
                  {progress.current} <span className="text-slate-200">/</span>{" "}
                  {progress.target}
                </p>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-blue-600 transition-all duration-1000"
                  ></div>
                </div>
                <p className="text-xl font-black text-blue-600 uppercase tracking-widest">
                  {Math.round(pct)}% Complete
                </p>
              </div>
            ) : (
              <p className="text-slate-400 italic">
                No goal set for {months.find((m) => m.id == month)?.name}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReadingGoals;
