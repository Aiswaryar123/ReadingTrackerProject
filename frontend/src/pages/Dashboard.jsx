import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/dashboard");
        setStats(response.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Reading Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!stats && !error && <p>Loading your stats...</p>}

      {stats && (
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ border: "1px solid #ccc", padding: "15px" }}>
            <h3>Total Books</h3>
            <p style={{ fontSize: "24px" }}>{stats.total_books}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "15px" }}>
            <h3>Finished</h3>
            <p style={{ fontSize: "24px" }}>{stats.books_finished}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "15px" }}>
            <h3>Average Rating</h3>
            <p style={{ fontSize: "24px" }}>{stats.average_rating} ⭐</p>
          </div>
        </div>
      )}
      <br />
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
