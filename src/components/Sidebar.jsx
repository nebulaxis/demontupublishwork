import { Link } from "react-router-dom";
import "../styles/Dashboard.css"; // Ensure you import the styles
import { FaTachometerAlt, FaUsers, FaVideo, FaChartLine, FaCog, FaFolder } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen }) => {
    return (
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <h2>LOGO</h2>
        <ul>
          <li><Link to="/dashboard" className="sidebar-link">Dashboard</Link></li>
          <li><Link to="/user-management" className="sidebar-link">User Management</Link></li>
          <li><Link to="/session-streaming" className="sidebar-link">Session Streaming</Link></li>
          <li><Link to="/content-management" className="sidebar-link">Content Management</Link></li>
          <li><Link to="/reports" className="sidebar-link">Reports</Link></li>
          <li><Link to="/settings" className="sidebar-link">Settings</Link></li>
        </ul>
      </div>
    );
  };
  
 

export default Sidebar;
