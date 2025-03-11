import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.jsx";
import AddApp from "./pages/AddApp.jsx";
import CreateApp from "./components/CreateApp";
import ViewApp from "./components/ViewApp";
import AddQuestions from "./components/AddQuestions";
import EditApp from "./components/EditApp";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/" />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Private Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-app" element={<PrivateRoute><AddApp /></PrivateRoute>} />
        <Route path="/create-app" element={<PrivateRoute><CreateApp /></PrivateRoute>} />
        <Route path="/view-app/:appId" element={<ViewApp />} />
        <Route path="/add-questions" element={<PrivateRoute><AddQuestions /></PrivateRoute>} />
        <Route path="/edit-app/:bundleId" element={<PrivateRoute><EditApp /></PrivateRoute>} />
        
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  </StrictMode>
);
