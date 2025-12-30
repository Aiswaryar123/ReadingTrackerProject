import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddBook from "./pages/AddBook";
import MyBooks from "./pages/MyBooks";
import UpdateProgress from "./pages/UpdateProgress";
import Review from "./pages/Review";
import ReadingGoals from "./pages/ReadingGoals";
import EditBook from "./pages/EditBook";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books/:id/progress" element={<UpdateProgress />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/books" element={<MyBooks />} />
        <Route path="/books/:id/edit" element={<EditBook />} />
        <Route path="/goals" element={<ReadingGoals />} />

        <Route path="/books/:id/review" element={<Review />} />
      </Routes>
    </Router>
  );
}

export default App;
