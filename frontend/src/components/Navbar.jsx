import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📚</span>
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            Bookshelf
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-blue-600 font-medium transition"
          >
            Dashboard
          </Link>
          <Link
            to="/books"
            className="text-gray-600 hover:text-blue-600 font-medium transition"
          >
            My Books
          </Link>
          <Link
            to="/add-book"
            className="text-gray-600 hover:text-blue-600 font-medium transition"
          >
            Add Book
          </Link>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
