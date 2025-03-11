import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const CreateApp = () => {
  const [appName, setAppName] = useState("");
  const [bundleId, setBundleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:6002/create-app", { appName, bundleId });

      if (response.data.success) {
        alert("✅ App Created Successfully!");
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Failed to create app.");
      }
    } catch (error) {
      console.error("❌ Error creating app:", error);
      setError(error.response?.data?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <h2>Create New App</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="app-form">
          <label>App Name:</label>
          <input type="text" value={appName} onChange={(e) => setAppName(e.target.value)} required />

          <label>Bundle Identifier:</label>
          <input type="text" value={bundleId} onChange={(e) => setBundleId(e.target.value)} required />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create App"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateApp;