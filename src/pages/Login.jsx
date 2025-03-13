import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("https://ntuproject.24livehost.com:6003/api/login", { username, password });

      if (response.data.success) {
        // ✅ Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // ✅ Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed, please try again.");
    }
  };

  return (
    <div className="login-container">
    <div className="login-card">
      <h2 className="login-heading">Welcome Back!</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <input
            type="text"
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="login-footer">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  </div>
  );
};

export default Login;
