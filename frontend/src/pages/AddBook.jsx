import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    total_pages: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/books", {
        ...formData,
        total_pages: parseInt(formData.total_pages),
      });

      alert("Book added successfully!");

      navigate("/dashboard");
    } catch (err) {
      setError("Failed to add book. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📖 Add a New Book</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input type="text" name="title" onChange={handleChange} required />
        </div>
        <br />
        <div>
          <label>Author: </label>
          <input type="text" name="author" onChange={handleChange} required />
        </div>
        <br />
        <div>
          <label>Total Pages: </label>
          <input
            type="number"
            name="total_pages"
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <button type="submit">Save Book</button>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddBook;
