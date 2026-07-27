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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiTURDLUFQSS1DRFItUlciLCJNREMtUC1HU1AtUiIsIlNULVAtQ01ULVIiLCJTVC1QLU5URi1SIiwiRVItUC1FUkItUlciLCJTVC1BUEktRU1QLVIiLCJNREMtQVBJLVBBVC1SIiwiU0lOLVAtRkEtUlciLCJTSU4tUC1SVC1SVyIsIkVSLVAtRVJQTC1SIiwiSE1TLVAtVklOUi1SIiwiTURDLVAtQUQtUiIsIk1EQy1BUEktUkRMLVJXIiwiTURDLVAtUkVHLVIiLCJTSU4tUC1FTlFMLVJXIiwiTURDLVAtT1NCLVJXIiwiTURDLVAtUE5QLVJXIiwiU0lOLUFQSS1PUi1SVyIsIk1EQy1QLVBOUC1SIiwiU1QtUC1ERVMtUlciLCJTSU4tUC1DSEVBLVJXIiwiRVItUC1FUlBCLVJXIiwiU1QtUC1TTk8tUlciLCJHUC1QLUdDTi1SIiwiU0lOLVAtQ0hFLVJXIiwiU1QtUC1UREwtUiIsIk1EQy1BUEktQVQtUlciLCJTSU4tQVBJLUdJQy1SIiwiTURDLVAtR1BQLVIiLCJNREMtQVBJLUFHUC1SVyIsIk1EQy1QLVBOUFItUiIsIlNJTi1SLUFWUCIsIlNJTi1BUEktSUYtUlciLCJTSU4tUC1HREwtUlciLCJTSU4tUC1SQVUtUlciLCJTSU4tUC1SVEEtUlciLCJNREMtQVBJLVRIUi1SIiwiRVItUC1FUlJFUC1SVyIsIkVSLVItRVJOIiwiSE1TLVItTlMiLCJNREMtQVBJLUNHUC1SVyIsIlNJTi1BUEktRlUtUlciLCJNREMtQVBJLVBHUC1SVyIsIk1EQy1SLUFETSIsIk1EQy1QLUdDUC1SIiwiSE1TLVAtQURNLVJXIiwiSE1TLVAtVlZQIiwiTURDLVAtR09QLVIiLCJTSU4tQVBJLU9SUi1SIiwiTURDLUFQSS1DRFItUiIsIlNULVAtREVTLVIiLCJNREMtUC1SRUctUlciLCJNREMtUC1TT1ItUiIsIlNULUFQSS1CUkQtUlciLCJNREMtUC1BU00tUlciLCJNREMtQVBJLVBBVCIsIk1EQy1BUEktTEJOLVIiLCJNREMtUC1HQVQtUiIsIk1EQy1BUEktR0FTLVIiLCJTSU4tUC1SQS1SVyIsIkhNUy1QLUFJTi1SVyIsIlNJTi1BUEktU0YtUlciLCJNREMtUC1BQVUtUlciLCJTVC1QLU5URi1SVyIsIk1EQy1BUEktUlRTLVIiLCJNREMtQVBJLVNHUC1SVyIsIkVSLVAtRVJHTkJOLVIiLCJITVMtUC1PUFAtUlciLCJTVC1QLUJSRC1SIiwiU0lOLVAtRlVBLVJXIiwiU0lOLVAtQ0YtUiIsIk1EQy1BUEktQVQtUiIsIlNULVAtVERMLVJXIiwiTURDLUFQSS1QREMtUlciLCJITVMtUC1BREQtUlciLCJFUi1QLUVSREwtUiIsIk1EQy1QLUdBUC1SIiwiU0lOLVAtRlUtUlciLCJTVC1BUEktQ1JELVJXIiwiU1QtUC1DTVQtUlciLCJITVMtUC1ETEQtUlciLCJTSU4tUC1PUC1SVyIsIk1EQy1BUEktTC1SVyIsIlNULVItSE9EIiwiTURDLVAtR09BLVJXIiwiTURDLVAtVFJCLVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNJTi1QLUVOUS1SVyIsIkhNUy1QLVNSTS1SVyIsIk1EQy1BUEktT0dQLVJXIiwiTURDLUFQSS1BRE0tUlciXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJob3NwaXRhbF9jb2RlIjoiU0gwMDEiLCJobXNfcGFnZXMiOls0Nl0sImFsbG93ZWQtb3V0bGV0cyI6WyJPTEVUMDA1Il0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzg1MTM4NzU3LCJleHAiOjE3ODUyMjU3NTd9.eaFP4SgrTtN9tlGnsDIYEHpYRZCMfmTEfPFWYGxFqDQFgvOjQ5fa6CCZ0iJyEtFeRxwtaPUbobE1uy9XzCbJvEtznDIlbwFuc66SdB48vnga0_1SF-LZq1xLJWvSBth3P-tzriryc20qZVzcjdLLz8SjmhepZwhWyT2LyRpKnfwAPkGSKxyMgcEgTqQUHaLds7stZVm9WyrBDcRDDzQRgHFoattVZsIuqRlo1kpJdhbyAKDPvxnhqQYSEC4JPA0s0TYodaCRoX7DK9qvaLDqs1gIfpUnqjVCDDDHWFHgaE6-qxa2hqFmnfY7nHE-io-LAX6S8yenoRPTZ6Cr4UCD9Q";
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
  if (allowedActions.includes("SIN-R-AVP")) {
    return "Insurance AVP";
  } else if (allowedActions.includes("SIN-R-ADM")) {
    return "Insurance Admin";
  } else if (allowedActions.includes("SIN-R-STA")) {
    return "Insurance Staff";
  } else if (allowedActions.includes("SIN-R-ACC")) {
    return "Insurance Accounts";
  } else if (allowedActions.includes("SIN-R-SA")) {
    return "Insurance Super Admin";
  } else if (allowedActions.includes("SIN-R-MAR")) {
    return "Insurance Marketting";
  } else if (allowedActions.includes("SIN-R-RT")) {
    return "RT Staff";
  } else if (allowedActions.includes("SIN-R-CHE")) {
    return "Chemo Staff";
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