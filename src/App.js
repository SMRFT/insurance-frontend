import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Sidebar from "./Components/Sidebar";
import { Shield, AlertCircle, Lock } from "lucide-react";

const InsuranceForm = lazy(() => import("./Components/InsuranceForm"));
const InsuranceReport = lazy(() => import("./Components/InsuranceReport"));
const FormUpdate = lazy(() => import("./Components/FormUpdate"));
const RadiotherapyReport = lazy(() => import("./Components/Radiotherapy"));
const OtherForm = lazy(() => import("./Components/OtherForm"));
const OtherUpdate = lazy(() => import("./Components/OtherUpdate"));
const OtherReport = lazy(() => import("./Components/OtherReport"));
const OtherGatePass = lazy(() => import("./Components/OtherGatePass"));
const OverallApproval = lazy(() => import("./Components/OverallApproval"));
const RefundApproval = lazy(() => import("./Components/RefundApproval"));
const EnquiryForm = lazy(() => import("./Components/EnquiryForm"));
const EnquiryList = lazy(() => import("./Components/EnquiryList"));
const EnquiryDetailPage = lazy(() => import("./Components/EnquiryReport"));

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
        <LoadingCard>
          <LogoBadge>
            <Shield size={28} strokeWidth={2} />
          </LogoBadge>
          <LoadingSpinner />
          <LoadingText>Authenticating session...</LoadingText>
          <LoadingSubtext>Shanmuga Insurance Portal</LoadingSubtext>
        </LoadingCard>
      </LoadingContainer>
    );
  }

  // If no role is set, something went wrong
  if (!role) {
    return (
      <ErrorContainer>
        <ErrorCard>
          <ErrorIcon><AlertCircle size={36} /></ErrorIcon>
          <ErrorTitle>Authentication Error</ErrorTitle>
          <ErrorMessage>Your session could not be validated. Please refresh the page or log in again.</ErrorMessage>
          <RefreshButton onClick={() => window.location.reload()}>Refresh Page</RefreshButton>
        </ErrorCard>
      </ErrorContainer>
    );
  }

  return (
    <AppContainer>
      <Sidebar userRole={role} />
      <MainContent>
        <Suspense fallback={<PageLoadingFallback><LoadingSpinner /><span>Loading...</span></PageLoadingFallback>}>
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
                <Route path="/EnquiryDetailPage" element={<EnquiryDetailPage />} />
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
                <Route path="/EnquiryDetailPage" element={<EnquiryDetailPage />} />
              </>
            )}

           {/* Insurance Marketting */}
            {role === "Insurance Marketting" && (
              <>
                <Route path="/" element={<EnquiryList />} />
                <Route path="/EnquiryList" element={<EnquiryList />} />
                <Route path="/EnquiryDetailPage" element={<EnquiryDetailPage />} />
              </>
            )}

            {/* Insurance Testing - Access to all routes */}
            {role === "Insurance Testing" && (
              <>
                {/* Default */}
                <Route path="/" element={<OverallApproval />} />

                {/* Insurance */}
                <Route path="/InsuranceForm" element={<InsuranceForm />} />
                <Route path="/FormUpdate" element={<FormUpdate />} />
                <Route path="/InsuranceReport" element={<InsuranceReport />} />

                {/* Other */}
                <Route path="/OtherForm" element={<OtherForm />} />
                <Route path="/OtherUpdate" element={<OtherUpdate />} />
                <Route path="/OtherReport" element={<OtherReport />} />
                <Route path="/OtherGatePass" element={<OtherGatePass />} />

                {/* Approval */}
                <Route path="/OverallApproval" element={<OverallApproval />} />
                <Route path="/RefundApproval" element={<RefundApproval />} />

                {/* Radiotherapy */}
                <Route
                  path="/RadiotherapyReport"
                  element={<RadiotherapyReport />}
                />

                {/* Enquiry */}
                <Route path="/EnquiryForm" element={<EnquiryForm />} />
                <Route path="/EnquiryList" element={<EnquiryList />} />
                <Route
                  path="/EnquiryDetailPage"
                  element={<EnquiryDetailPage />}
                />
              </>
            )}

            {/* Fallback for unauthorized access */}
            <Route path="*" element={
              <AccessDenied>
                <AccessDeniedCard>
                  <AccessDeniedIcon><Lock size={40} /></AccessDeniedIcon>
                  <AccessDeniedTitle>Access Denied</AccessDeniedTitle>
                  <AccessDeniedText>You don&apos;t have permission to view this page.</AccessDeniedText>
                  <AccessDeniedSub>If you believe this is a mistake, please contact your administrator.</AccessDeniedSub>
                </AccessDeniedCard>
              </AccessDenied>
            } />
          </Routes>
        </Suspense>
      </MainContent>
    </AppContainer>
  );
}

// ── Animations ──────────────────────────────────────────────────────────
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;

// ── Layout ────────────────────────────────────────────────────────────────
const AppContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background: #EDF2F0;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 260px;
  width: calc(100% - 260px);
  min-height: 100vh;
  background: var(--color-bg, #EDF2F0);
  overflow-x: hidden;

  @media (max-width: 1200px) { margin-left: 240px; width: calc(100% - 240px); }
  @media (max-width: 768px)  { margin-left: 0; width: 100%; padding-top: 60px; }
`;

// ── Loading Screen ───────────────────────────────────────────────────────
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #EDF2F0 0%, #D0E2DE 100%);
  font-family: 'Inter', 'Poppins', sans-serif;
`;

const LoadingCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  background: white;
  border-radius: 20px;
  padding: 48px 56px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  animation: ${fadeInUp} 0.5s ease;
  border: 1px solid #DDE6E3;
`;

const LogoBadge = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4E7B6F, #9AB3AB);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 6px 20px rgba(78,123,111,0.35);
  animation: ${pulse} 2s ease infinite;
`;

const LoadingSpinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid rgba(78,123,111,0.15);
  border-top-color: #4E7B6F;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #1A2E2B;
  margin: 0;
  letter-spacing: -0.2px;
`;

const LoadingSubtext = styled.p`
  font-size: 13px;
  color: #7A9A93;
  margin: 0;
`;

const PageLoadingFallback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  gap: 12px;
  color: #4A6660;
  font-size: 14px;
  font-family: 'Inter', 'Poppins', sans-serif;
`;

// ── Error Screen ──────────────────────────────────────────────────────────
const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #EDF2F0 0%, #D0E2DE 100%);
  padding: 20px;
  font-family: 'Inter', 'Poppins', sans-serif;
`;

const ErrorCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 20px;
  padding: 48px 56px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 420px;
  border: 1px solid #DDE6E3;
  animation: ${fadeInUp} 0.5s ease;
`;

const ErrorIcon = styled.div`
  color: #DC2626;
  opacity: 0.85;
`;

const ErrorTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1A2E2B;
  margin: 0;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  color: #4A6660;
  margin: 0;
  line-height: 1.6;
`;

const RefreshButton = styled.button`
  margin-top: 8px;
  padding: 10px 24px;
  background: #4E7B6F;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  &:hover { background: #3A5C52; transform: translateY(-1px); }
`;

// ── Access Denied ─────────────────────────────────────────────────────────
const AccessDenied = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 40px 20px;
  font-family: 'Inter', 'Poppins', sans-serif;
`;

const AccessDeniedCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 48px 56px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  max-width: 420px;
  border: 1px solid #DDE6E3;
  animation: ${fadeInUp} 0.4s ease;

  @media (max-width: 576px) { padding: 32px 24px; }
`;

const AccessDeniedIcon = styled.div`
  color: #9AB3AB;
  opacity: 0.7;
`;

const AccessDeniedTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #4E7B6F;
  margin: 0;
`;

const AccessDeniedText = styled.p`
  font-size: 15px;
  color: #1A2E2B;
  margin: 0;
  font-weight: 500;
`;

const AccessDeniedSub = styled.p`
  font-size: 13px;
  color: #7A9A93;
  margin: 0;
  line-height: 1.6;
`;

function App() {
  return (
    <Router basename="/insurance">
      <AppContent />
    </Router>
  );
}

export default App;