import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  BookOpen,
  LayoutDashboard,
  Target,
  PlusCircle,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "My Books", path: "/books", icon: <BookOpen size={18} /> },
    { name: "Goals", path: "/goals", icon: <Target size={18} /> },
    { name: "Add Book", path: "/add-book", icon: <PlusCircle size={18} /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div
            className="flex items-center space-x-2 group cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-100 group-hover:rotate-12 transition-transform">
              <span className="text-xl">📚</span>
            </div>
            <span className="text-xl font-black text-gray-800 uppercase tracking-tighter">
              Bookshelf
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  isActive(link.path)
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-50"
                    : "text-gray-400 hover:text-blue-500 hover:bg-gray-50"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            <div className="h-6 w-px bg-gray-100 mx-4"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-rose-50 text-rose-500 font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-blue-600 focus:outline-none p-2 rounded-lg bg-gray-50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-50 space-y-2 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest ${
                  isActive(link.path)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-gray-500 bg-gray-50"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 bg-rose-50 text-rose-500 font-black text-sm uppercase tracking-widest px-4 py-4 rounded-2xl border border-rose-100 mt-4"
            >
              <LogOut size={18} />
              Logout Session
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
