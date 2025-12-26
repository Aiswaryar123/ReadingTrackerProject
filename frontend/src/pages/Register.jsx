import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/register", formData);

      console.log("Success! User created:", response.data);
      alert("Registration Successful! Please login.");

      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.error || "Registration failed. Try again.";
      setError(message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create an Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>
        <br />
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
