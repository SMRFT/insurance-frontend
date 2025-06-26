import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import InsuranceForm from "./Components/InsuranceForm";
import Login from "./Components/Login";
import Register from "./Components/Register";
import InsuranceReport from "./Components/InsuranceReport";
import Sidebar from "./Components/Sidebar";
import Daycare from "./Components/Daycare";
import DaycareReport from "./Components/DaycareReport";
import FormUpdate from "./Components/FormUpdate";
import RadiotherapyReport from "./Components/Radiotherapy";
import PrivateRoute from "./Components/PrivateRoute";
import { Navigate } from "react-router-dom"; // import Navigate
import OtherReport from "./Components/OtherReport";
import OtherForm from "./Components/OtherForm";
import OtherUpdate from "./Components/OtherUpdate";
function AppContent() {
  const location = useLocation();
  const hideSidebarRoutes = ["/"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ marginLeft: hideSidebar ? "0" : "280px", padding: "20px", width: "100%" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={ <Register />} />

          {/* Protected Routes below */}
          <Route
            path="/InsuranceForm"
            element={
              <PrivateRoute>
                <InsuranceForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/InsuranceReport"
            element={
              <PrivateRoute>
                <InsuranceReport />
              </PrivateRoute>
            }
          />
          <Route
            path="/Daycare"
            element={
              <PrivateRoute>
                <Daycare />
              </PrivateRoute>
            }
          />
          <Route
            path="/DaycareReport"
            element={
              <PrivateRoute>
                <DaycareReport />
              </PrivateRoute>
            }
          />
          <Route
            path="/RadiotherapyReport"
            element={
              <PrivateRoute>
                <RadiotherapyReport />
              </PrivateRoute>
            }
          />
          <Route
            path="/FormUpdate"
            element={
              <PrivateRoute>
                <FormUpdate />
              </PrivateRoute>
            }
          />
          <Route
            path="/OtherForm"
            element={
              <PrivateRoute>
                <OtherForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/OtherReport"
            element={
              <PrivateRoute>
                <OtherReport />
              </PrivateRoute>
            }
          />
           <Route
            path="/OtherUpdate"
            element={
              <PrivateRoute>
                <OtherUpdate />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
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
