import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📚</span>
          <span className="text-xl font-black text-gray-800 uppercase tracking-tighter">
            Bookshelf
          </span>
        </div>

        <div className="flex items-center space-x-8">
          <Link
            to="/dashboard"
            className="text-gray-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition"
          >
            Dashboard
          </Link>
          <Link
            to="/books"
            className="text-gray-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition"
          >
            My Books
          </Link>
          <Link
            to="/goals"
            className="text-gray-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition"
          >
            Goals
          </Link>
          <Link
            to="/add-book"
            className="text-gray-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition"
          >
            Add Book
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-500 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
