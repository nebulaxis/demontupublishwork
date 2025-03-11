import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "../styles/Dashboard.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="navbar flex justify-between items-center p-4 shadow-md">
      {/* Sidebar Toggle Button */}
      <button onClick={toggleSidebar} className="text-white p-2 md:hidden">
        <FaBars size={24} />
      </button>

      {/* Search Box */}
      <input type="text" placeholder="Search..." className="search-box" />

      {/* User Profile Section */}
      <div className="flex items-center space-x-4">
        <span className="font-semibold">Hi, Laura Jane</span>
        <div className="profile-icon"></div>
      </div>
    </div>
  );
};

export default Navbar;
