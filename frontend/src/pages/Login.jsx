import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/login", formData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl border border-white/20">
          <div className="text-center mb-10">
            <span className="text-6xl inline-block mb-4 drop-shadow-md">
              📖
            </span>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              Welcome Back
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Sign in to your digital library
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-2xl animate-shake">
              <p className="text-red-700 text-xs font-black uppercase tracking-widest">
                ⚠️ {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-6 py-4 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700 placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900  text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Validating..." : "Enter Bookshelf"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm font-medium">
              New to the platform?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-black uppercase tracking-tighter hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
