import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./Components/Sidebar";
import InsuranceForm from "./Components/InsuranceForm";
import InsuranceReport from "./Components/InsuranceReport";
import FormUpdate from "./Components/FormUpdate";
import RadiotherapyReport from "./Components/Radiotherapy";
import OtherForm from "./Components/OtherForm";
import OtherUpdate from "./Components/OtherUpdate";
import OtherReport from "./Components/OtherReport";
import OtherGatePass from "./Components/OtherGatePass";
import OverallApproval from "./Components/OverallApproval";
import RefundApproval from "./Components/RefundApproval";
import EnquiryForm from "./Components/EnquiryForm";
import EnquiryList from "./Components/EnquiryList";
import EnquiryDetailPage from "./Components/EnquiryReport";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNavigatedToRole, setHasNavigatedToRole] = useState(false);

  // Function to navigate based on role
  const navigateRole = (userRole) => {
    switch (userRole) {
      case "Insurance Staff":
        navigate("/");
        break;
      case "Insurance Admin":
        navigate("/OtherUpdate");
        break;
      case "Insurance Accounts":
        navigate("/InsuranceReport");
        break;
      case "Insurance Super Admin":
        navigate("/");
        break;
      default:
        navigate("/");
    }
  };

  // Check token and navigate based on role
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("access_token");
    
    console.log("App.js - User data loaded:", {
      storedRole,
      hasToken: !!token,
      currentPath: location.pathname,
    });

    if (storedRole && token) {
      setRole(storedRole);
      // Only navigate to role-specific page if we're on the root path and haven't navigated yet
      if (location.pathname === "/" && !hasNavigatedToRole) {
        console.log("Navigating based on role:", storedRole);
        navigateRole(storedRole);
        setHasNavigatedToRole(true);
      }
    }
    setIsLoading(false);
  }, [location.pathname, navigate, hasNavigatedToRole]);

  // Reset navigation flag when location changes
  useEffect(() => {
    if (location.pathname !== "/") {
      setHasNavigatedToRole(true);
    }
  }, [location.pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <LoadingContainer>
        Loading...
      </LoadingContainer>
    );
  }

  // If no role is set, something went wrong
  if (!role) {
    return (
      <ErrorContainer>
        Authentication error. Please refresh the page.
      </ErrorContainer>
    );
  }

  return (
    <AppContainer>
      <Sidebar userRole={role} />
      <MainContent>
        <Routes>
          {/* Insurance Staff Routes */}
          {role === "Insurance Staff" && (
            <>
              <Route path="/" element={<InsuranceForm />} />
              <Route path="/OtherForm" element={<OtherForm />} />
              <Route path="/InsuranceForm" element={<InsuranceForm />} />
              <Route path="/FormUpdate" element={<FormUpdate />} />
              <Route path="/InsuranceReport" element={<InsuranceReport />} />
              <Route path="/OtherReport" element={<OtherReport />} />
              <Route path="/EnquiryForm" element={<EnquiryForm />} />
            </>
          )}

          {/* Insurance Admin Routes */}
          {role === "Insurance Admin" && (
            <>
              <Route path="/" element={<OtherUpdate />} />
              <Route path="/OtherForm" element={<OtherForm />} />
              <Route path="/InsuranceForm" element={<InsuranceForm />} />
              <Route path="/FormUpdate" element={<FormUpdate />} />
              <Route path="/OtherUpdate" element={<OtherUpdate />} />
              <Route path="/OtherGatePass" element={<OtherGatePass />} />
              <Route path="/InsuranceReport" element={<InsuranceReport />} />
              <Route path="/OtherReport" element={<OtherReport />} />
              <Route path="/RadiotherapyReport" element={<RadiotherapyReport />} />
              <Route path="/EnquiryForm" element={<EnquiryForm />} />
            </>
          )}

          {/* Insurance Accounts Routes */}
          {role === "Insurance Accounts" && (
            <>
              <Route path="/" element={<OtherReport />} />
              <Route path="/InsuranceReport" element={<InsuranceReport />} />
              <Route path="/OtherReport" element={<OtherReport />} />
            </>
          )}

          {/* Insurance Super Admin Routes */}
          {role === "Insurance Super Admin" && (
            <>
              <Route path="/" element={<OverallApproval />} />
              <Route path="/OtherForm" element={<OtherForm />} />
              <Route path="/InsuranceForm" element={<InsuranceForm />} />
              <Route path="/FormUpdate" element={<FormUpdate />} />
              <Route path="/OtherUpdate" element={<OtherUpdate />} />
              <Route path="/InsuranceReport" element={<InsuranceReport />} />
              <Route path="/OtherReport" element={<OtherReport />} />
              <Route path="/RadiotherapyReport" element={<RadiotherapyReport />} />
              <Route path="/OverallApproval" element={<OverallApproval />} />
              <Route path="/RefundApproval" element={<RefundApproval />} />
              <Route path="/EnquiryList" element={<EnquiryList />} />
              <Route path="/EnquiryForm" element={<EnquiryForm />} />
              <Route path="/EnquiryDetailPage" element={<EnquiryDetailPage />} />
            </>
          )}

         {/* Insurance Marketting */}
          {role === "Insurance Marketting" && (
            <>
              <Route path="/" element={<EnquiryDetailPage />} />
              <Route path="/EnquiryDetailPage" element={<EnquiryDetailPage />} />
            </>
          )}


          {/* Fallback for unauthorized access */}
          <Route path="*" element={
            <AccessDenied>
              <h2>Access Denied</h2>
              <p>You don't have permission to view this page.</p>
            </AccessDenied>
          } />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

// Styled Components
const AppContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 260px;
  width: calc(100% - 260px);
  min-height: 100vh;
  background-color: #f5f5f5;
  overflow-x: hidden;
  
  @media (max-width: 1024px) {
    margin-left: 240px;
    width: calc(100% - 240px);
  }
  
  @media (max-width: 768px) {
    margin-left: 200px;
    width: calc(100% - 200px);
  }
  
  @media (max-width: 576px) {
    margin-left: 70px;
    width: calc(100% - 70px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #6F8B83;
  font-family: 'Poppins', sans-serif;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #d32f2f;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  text-align: center;
`;

const AccessDenied = styled.div`
  padding: 40px 20px;
  text-align: center;
  
  h2 {
    color: #6F8B83;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
  }
  
  @media (max-width: 576px) {
    padding: 30px 15px;
    
    h2 {
      font-size: 20px;
    }
    
    p {
      font-size: 14px;
    }
  }
`;

function App() {
  return (
    <Router basename="/insurance">
      <AppContent />
    </Router>
  );
}

export default App;