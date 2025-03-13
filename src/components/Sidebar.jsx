import { Link } from "react-router-dom";
import "../styles/Sidebar.css"; // Ensure you import the styles
import { FaTachometerAlt, FaUsers, FaVideo, FaChartLine, FaCog, FaFolder } from "react-icons/fa";
import logo from "../assets/logo.png"; // Adjust the path based on where you placed the logo

const Sidebar = ({ isSidebarOpen }) => {
    return (
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <img src={logo} alt="Logo" className="sidebar-logo" /> {/* Add the logo image */}
        <ul>
          <li><Link to="/dashboard" className="sidebar-link">Dashboard</Link></li>
          <li><Link to="/user-management" className="sidebar-link">User  Management</Link></li>
          <li><Link to="/session-streaming" className="sidebar-link">Session Streaming</Link></li>
          <li><Link to="/content-management" className="sidebar-link">Content Management</Link></li>
          <li><Link to="/reports" className="sidebar-link">Reports</Link></li>
          <li><Link to="/settings" className="sidebar-link">Settings</Link></li>
        </ul>
      </div>
    );
};

export default Sidebar;