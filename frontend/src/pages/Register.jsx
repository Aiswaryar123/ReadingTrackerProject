import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create an Account</h2>
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
      <p>
        Already have an account?{" "}
        <button onClick={() => navigate("/login")}>Login here</button>
      </p>
    </div>
  );
}

export default Register;
