import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", formData);

      const token = response.data.token;
      localStorage.setItem("token", token);

      console.log("Login Successful! Token saved.");
      alert("Login Successful!");

      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.error || "Login failed. Check your email/password.";
      setError(message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login to Your Bookshelf</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <br />
        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <button onClick={() => navigate("/register")}>Register here</button>
      </p>
    </div>
  );
}

export default Login;
