import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css"; // Ensure styles are imported

const Dashboard = () => {
  const [apps, setApps] = useState([]); // State for storing apps
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  const navigate = useNavigate();

  // Fetch apps when component mounts
  useEffect(() => {
    axios
      .get("https://ntuproject.24livehost.com:6003/get-apps")
      .then((res) => {
        if (res.data.success) {
          setApps(res.data.apps || []); // Ensure apps is an array
        } else {
          setError("Failed to load apps.");
        }
      })
      .catch((err) => {
        console.error("Error fetching apps:", err);
        setError("Error fetching apps. Please try again.");
      })
      .finally(() => {
        setLoading(false); // Stop loading after request finishes
      });
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Navbar */}
        <Navbar />

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h2>App Management Dashboard</h2>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="dashboard-grid">
            {/* Create App Card */}
            <button onClick={() => navigate("/create-app")} className="create-app-card">
              <span className="plus-sign">+</span>
              <span className="create-text">Create App</span>
            </button>

            {/* Loading State */}
            {loading && <p>Loading apps...</p>}

            {/* Error State */}
            {error && <p className="error-message">{error}</p>}

            {/* Display Existing Apps */}
            {!loading && !error && apps.length > 0 ? (
              apps.map((app) => (
                <div key={app.id} className="app-card">
                  <h3>{app.appName}</h3> {/* Ensure this matches your DB column name */}
                  <p>Bundle ID: {app.bundleId}</p>
                  <button onClick={() => navigate(`/view-app/${app.id}`)} className="view-app-btn">
                    View & Manage Questions
                  </button>
                </div>
              ))
            ) : (
              !loading && !error && <p>No apps found. Try creating one!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
