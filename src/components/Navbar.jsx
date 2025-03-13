import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="navbar">
    {/* Sidebar Toggle Button */}
    <button onClick={toggleSidebar} className="toggle-btn">
      <FaBars size={24} />
    </button>

    {/* Search Box */}
    <input type="text" placeholder="Search..." className="search-box" />

    {/* User Profile Section */}
    <div className="user-info">
      <span className="username">Hi, Laura Jane</span>
      <div className="profile-icon"></div>
    </div>
  </div>
  );
};

export default Navbar;
