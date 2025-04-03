import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import InsuranceForm from "./Components/InsuranceForm";
import Login from "./Components/Login";
import Register from "./Components/Register";
import InsuranceReport from "./Components/InsuranceReport";
import Sidebar from "./Components/Sidebar";

function AppContent() {
  const location = useLocation();

  // Check if the current route is one where the sidebar should be hidden
  const hideSidebarRoutes = ["/", "/Register"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {/* Conditionally render the Sidebar */}
      {!hideSidebar && <Sidebar />}

      {/* Main content */}
      <div
        style={{
          marginLeft: hideSidebar ? "0" : "220px", // Adjust margin if the sidebar is hidden
          padding: "20px",
          width: "100%",
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/InsuranceForm" element={<InsuranceForm />} />
          <Route path="/InsuranceReport" element={<InsuranceReport />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
