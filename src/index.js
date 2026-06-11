import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Bootstrap CSS removed - it was interfering with responsive design
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

console.log("=== INSURANCE INDEX.JS DEBUG ===");
console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiTURDLUFQSS1TR1AtUlciLCJTRC1QLURGLVJXIiwiU0QtQVBJLVJCLVIiLCJTRC1SLUxUIiwiU0lOLUFQSS1JRi1SVyIsIlNULVAtTlRGLVJXIiwiTURDLUFQSS1SREwtUlciLCJITVMtUC1TUk0tUlciLCJTVC1QLVRETC1SIiwiU0QtUC1URS1SVyIsIkVSLVAtRVJQTC1SIiwiTURDLVAtR09QLVIiLCJTRC1QLUhNU0NTLVIiLCJTVC1QLURFUy1SVyIsIlNJTi1BUEktT1ItUlciLCJTVC1QLUNNVC1SIiwiU0QtUC1TUy1SVyIsIlNELVAtVERFLVJXIiwiTURDLVAtUkVHLVIiLCJTVC1BUEktQ1JELVJXIiwiU0lOLVAtR0lDLVIiLCJTSU4tQVBJLU9SUi1SIiwiTURDLUFQSS1PR1AtUlciLCJTRC1QLVBPVi1SVyIsIlNJTi1BUEktRlUtUlciLCJNREMtQVBJLUNHUC1SVyIsIkhNUy1QLVZJTlIiLCJITVMtUC1WSU4iLCJNREMtUC1HQVAtUiIsIlNELVAtSE1TUFMtUlciLCJTSU4tQVBJLVNGLVIiLCJTVC1SLUhPRCIsIk1EQy1QLVBOUFItUiIsIlNELVAtSE1TR0MtUiIsIkVSLVAtRVJETC1SIiwiU0QtUC1SRC1SVyIsIk1EQy1BUEktTEJOLVIiLCJFUi1SLUVSTiIsIlNELVAtTUlTLVIiLCJNREMtUC1PU0ItUlciLCJHUC1QLUdDTi1SIiwiU1QtUC1DTVQtUlciLCJTRC1BUEktTUlTLVJXIiwiTURDLUFQSS1QQVQiLCJTRC1QLUhNU1VDLVJXIiwiTURDLVAtVFJCLVJXIiwiU0lOLVAtQ0YtUiIsIk1EQy1QLVBOUC1SIiwiU0QtUC1ITVNURC1SIiwiU0QtUC1TQS1SVyIsIkhNUy1SLU5TIiwiTURDLVAtR1BQLVIiLCJTVC1BUEktQU1DLVJXIiwiTURDLVAtU09SLVIiLCJTRC1BUEktQ04tUiIsIk1EQy1BUEktQURNLVJXIiwiU0QtUC1NQlRWLVIiLCJTRC1QLUhNU0dQLVIiLCJTVC1BUEktRU1QLVIiLCJTRC1QLUhNU1BCLVJXIiwiU1QtUC1CUkQtUiIsIlNULVAtREVTLVIiLCJTRC1QLUhNU1NTLVJXIiwiU0lOLVAtR0RMLVJXIiwiTURDLUFQSS1QQVQtUiIsIk1EQy1BUEktUERDLVJXIiwiSE1TLVAtQUlOLVJXIiwiSE1TLVAtQURELVJXIiwiU1QtUC1UREwtUlciLCJTVC1QLVNOTy1SVyIsIkhNUy1QLUFETS1SVyIsIlNELVAtU1MtUiIsIlNELVAtUE9WLVIiLCJTSU4tUC1FTlEtUlciLCJTSU4tUi1BRE0iLCJNREMtUC1BU00tUlciLCJTRC1QLVRELVJXIiwiTURDLVAtUkVHLVJXIiwiU0QtUC1ITVNTRC1SIiwiU0QtUC1SRy1SVyIsIk1EQy1BUEktR0FTLVIiLCJNREMtUC1BQVUtUlciLCJNREMtUC1HU1AtUiIsIk1EQy1BUEktQUdQLVJXIiwiRVItUC1FUkdOQk4tUiIsIlNELVAtTUJQRC1SIiwiU0QtUC1ITVNTUC1SIiwiTURDLVAtUE5QLVJXIiwiU0QtQVBJLVRNLVJXIiwiRVItUC1FUlJFUC1SVyIsIlNELVAtTUJERi1SVyIsIlNELVAtUEQtUlciLCJNREMtUi1BRE0iLCJTVC1BUEktQlJELVJXIiwiU0QtUC1TU1UtUlciLCJNREMtQVBJLVJUUy1SIiwiSE1TLVAtVlYiLCJTRC1QLVNTVS1SIiwiRVItUC1FUkItUlciLCJNREMtQVBJLUFULVIiLCJNREMtQVBJLVRIUi1SIiwiU1QtUC1OVEYtUiIsIkVSLVAtRVJQQi1SVyIsIk1EQy1BUEktQVQtUlciLCJITVMtUC1PUFAtUlciLCJNREMtQVBJLUNEUi1SIiwiU0QtUC1ITVNCRC1SVyIsIlNELVAtSE1TTEQtUiIsIkhNUy1QLURMRC1SVyIsIlNELUFQSS1NQlRELVJXIiwiU0QtQVBJLVRWLVIiLCJNREMtQVBJLVBHUC1SVyIsIlNELUFQSS1HRC1SIiwiTURDLVAtR0NQLVIiLCJTRC1BUEktVE0tUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6WzQwLDQxLDQyLDQ2XSwiYWxsb3dlZC1vdXRsZXRzIjpbXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODExNzkxMzQsImV4cCI6MTc4MTI2NjEzNH0.Ti5-8OkCf2jhCNlQebZPcpKxqKzVtJLR9lSrb-PiKCmBh8vOziU_JJTkn87gVeDhRoMGL9T_d9Po750kK7p55_Sj0moYnsTnlKNCICCr19vWpjQO-52oOs9jgzZjs3WKa-Tn0FxMAWZnXjM6qJ4NisJhDl2_E1eJ6aIJQTAIuOTPHgWmHZl3MVmf9a74XOyAGMfurfCoQquukdTs5BNdbLP1IYdUGJ3CW9BtKwiu6eEeJiU84CRq_UA_0R75DQcFUWPlswcwqNjgpkVZ90u3bEYa_unJLAD5htQXnRp9HmDhulXmzLcLk_fIXBNozz--oKOlKn40LlrDALkTfRRXSg";
  console.log("🔧 Using development token");
  const selectedBranch = "SHB001";
  localStorage.setItem("selected_branch", selectedBranch);
  return dev_token;
}

// --- Function to redirect to login ---
function redirectToLogin() {
  if (REDIRECT_URL) {
    console.log("🔄 Redirecting to login URL:", REDIRECT_URL);
    window.location.href = REDIRECT_URL;
  } else {
    console.error("❌ REDIRECT_URL not configured");
    window.location.href = "https://shinova.in/login";
  }
}

// --- Validate JWT Token Locally ---
function validate(token) {
  if (!token || token.trim() === "") {
    throw new Error("Token is empty");
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// --- Function to determine user role based on allowed-actions ---
function getUserRole(allowedActions) {
  if (!allowedActions || !Array.isArray(allowedActions)) {
    return "Insurance Staff"; // Default role.
  }

  // Insurance-specific roles
  if (allowedActions.includes("SIN-R-ADM")) {
    return "Insurance Admin";
  } else if (allowedActions.includes("SIN-R-STA")) {
    return "Insurance Staff";
  } else if (allowedActions.includes("SIN-R-ACC")) {
    return "Insurance Accounts";
  } else if (allowedActions.includes("SIN-R-SA")) {
    return "Insurance Super Admin";
  } else if (allowedActions.includes("SIN-R-MAR")) {
    return "Insurance Marketting";
  } else {
    return "Insurance Staff"; // Default role
  }
}

// --- Main execution ---
(function main() {
  try {
    console.log("Starting token validation...");

    // Retrieve token from localStorage
    let accessToken = localStorage.getItem("access_token");
    console.log("Access token from localStorage exists:", !!accessToken);

    // If no token found, try development token
    if (!accessToken) {
      console.log("❌ No token found in localStorage, trying development token");
      accessToken = setforlocaldev();
    }

    // If still no token (development token is empty), redirect to login
    if (!accessToken || accessToken.trim() === "") {
      console.log("❌ No valid token available, redirecting to login");
      localStorage.removeItem("access_token");
      redirectToLogin();
      return;
    }

    // Validate the token
    const userPayload = validate(accessToken);
    console.log("✅ Token validated successfully");
    console.log("Decoded token payload:", userPayload);

    // Store the valid token and user information
    localStorage.setItem("access_token", accessToken);

    // Extract user information from token payload
    const employeeId = userPayload.aud;
    const name = userPayload.name;
    const userEmail = userPayload.email;
    const userRole = getUserRole(userPayload["allowed-actions"]);

    console.log("Employee ID:", employeeId);
    console.log("Name:", name);
    console.log("Email:", userEmail);
    console.log("User Role:", userRole);

    // Check if we have required data
    const isLoggedIn = !!(employeeId && name);
    console.log("Is logged in:", isLoggedIn);

    if (!isLoggedIn) {
      throw new Error("Missing required user data (employeeId or name)");
    }

    // Store user payload and extracted information
    localStorage.setItem("user_payload", JSON.stringify(userPayload));
    localStorage.setItem("employeeId", employeeId);
    localStorage.setItem("name", name);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("role", userRole);

    // Store user object for compatibility
    localStorage.setItem("user", JSON.stringify({ name, employeeId, email: userEmail, role: userRole }));

    console.log("✅ User payload and extracted data stored in localStorage");
    console.log("Stored data:", { employeeId, name, userEmail, role: userRole });

    // Token is valid, render app
    console.log("✅ Rendering insurance app...");
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    reportWebVitals();
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();