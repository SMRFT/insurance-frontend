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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtQVBJLUNOLVJXIiwiSE1TLVAtQUlOLVJXIiwiU0lOLVAtT1AtUlciLCJTRC1QLUdQQi1SIiwiTURDLVAtVFJCLVJXIiwiU1QtUC1UREwtUlciLCJTRC1QLVVQQi1SVyIsIlNJTi1BUEktT1JSLVIiLCJTRC1QLUxHRS1SVyIsIlNELVAtTEJGLVJXIiwiU0lOLVAtRkEtUlciLCJTVC1QLUNNVC1SVyIsIk1EQy1QLUdQUC1SIiwiU1QtUC1CUkQtUiIsIlNELVAtUEItUlciLCJITVMtUC1ETEQtUlciLCJNREMtUC1HQ1AtUiIsIk1EQy1BUEktTC1SVyIsIkhNUy1QLUFETS1SVyIsIk1EQy1BUEktUlRTLVIiLCJNREMtUC1QTlAtUiIsIkhNUy1QLVNSTS1SVyIsIkVSLVAtRVJCLVJXIiwiTURDLVAtR09QLVIiLCJTSU4tQVBJLUZVLVJXIiwiU1QtQVBJLUJSRC1SVyIsIk1EQy1QLUFELVIiLCJTRC1BUEktVE0tUlciLCJNREMtQVBJLUFETS1SVyIsIkVSLVAtRVJSRVAtUlciLCJTVC1BUEktQU1DLVJXIiwiSE1TLVItTlMiLCJTSU4tUC1GVS1SVyIsIlNULVAtVERMLVIiLCJITVMtUC1BREQtUlciLCJFUi1QLUVSREwtUiIsIk1EQy1BUEktU0dQLVJXIiwiTURDLUFQSS1BVC1SVyIsIlNULUFQSS1DUkQtUlciLCJNREMtQVBJLVBHUC1SVyIsIlNELUFQSS1SQi1SVyIsIlNELVAtTFBJLVIiLCJNREMtQVBJLVRIUi1SIiwiRVItUC1FUlBMLVIiLCJTVC1SLUhPRCIsIk1EQy1BUEktT0dQLVJXIiwiU0QtUC1TU1UtUlciLCJTSU4tUi1UU1QiLCJTRC1QLUJURC1SVyIsIlNULVAtTlRGLVJXIiwiTURDLUFQSS1SREwtUlciLCJNREMtQVBJLUxCTi1SIiwiTURDLUFQSS1BVC1SIiwiU1QtUC1OVEYtUiIsIk1EQy1BUEktUERDLVJXIiwiSE1TLVAtVklOUi1SIiwiU0QtUC1MQk4tUiIsIlNELVAtUE9WLVJXIiwiTURDLUFQSS1BR1AtUlciLCJTSU4tUC1SQS1SVyIsIlNULVAtQ01ULVIiLCJFUi1QLUVSUEItUlciLCJHUC1QLUdDTi1SIiwiU0QtUC1TUy1SIiwiTURDLVAtUkVHLVIiLCJTRC1QLUxUTS1SVyIsIkVSLVItRVJOIiwiU0lOLVAtR0RMLVJXIiwiU0lOLVAtUkFVLVJXIiwiSE1TLVAtVlZQIiwiTURDLVAtUE5QLVJXIiwiTURDLVAtQUFVLVJXIiwiU1QtQVBJLUVNUC1SIiwiU0QtUC1QRi1SVyIsIk1EQy1BUEktQ0RSLVIiLCJNREMtUC1PU0ItUlciLCJTRC1QLUdTUC1SIiwiTURDLVAtUkVHLVJXIiwiU0lOLUFQSS1PUi1SVyIsIlNELVItU01DIiwiTURDLVAtR1NQLVIiLCJNREMtUC1BU00tUlciLCJTRC1BUEktVEQtUiIsIk1EQy1QLVNPUi1SIiwiU0QtUC1TUy1SVyIsIlNULVAtU05PLVJXIiwiU1QtUC1ERVMtUlciLCJTRC1QLVNDLVIiLCJTSU4tQVBJLUlGLVJXIiwiU0QtQVBJLVNTLVJXIiwiTURDLVAtUE5QUi1SIiwiTURDLUFQSS1DR1AtUlciLCJTRC1QLUJHLVJXIiwiTURDLVAtR09BLVJXIiwiU0lOLUFQSS1TRi1SVyIsIlNELVAtQkEtUlciLCJTSU4tUC1DRi1SIiwiU0QtUC1SQi1SVyIsIk1EQy1BUEktUEFULVIiLCJNREMtQVBJLUdBUy1SIiwiU0QtUC1QRy1SVyIsIlNULVAtREVTLVIiLCJTSU4tUC1HSUMtUiIsIlNELVAtTFJDLVIiLCJFUi1QLUVSR05CTi1SIiwiTURDLVItQURNIiwiU0lOLVAtRU5RLVJXIiwiTURDLUFQSS1QQVQiLCJNREMtUC1HQVAtUiIsIkhNUy1QLU9QUC1SVyIsIlNELVAtU1AtUiIsIk1EQy1QLUdBVC1SIiwiU0lOLVAtRU5RTC1SVyIsIlNJTi1QLUZVQS1SVyIsIlNELVAtR1BELVIiLCJTRC1QLUxCQy1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6WzQ2XSwiYWxsb3dlZC1vdXRsZXRzIjpbIk9MRVQwMDUiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODM5MTQ5NDEsImV4cCI6MTc4NDAwMTk0MX0.VszxeLm9QQ3XhCri5CHQZOqNm5CSCdGbiKEy1ZKQhQ7gPjO16u0C4MNlCMonTxcWUQIri-oc5OUWQ1S4DK_Ttn4SQVU4NMOd_bmjF3IOQ1d13ne_r5ACEAlXtl--VZ1WBKc0gHjjMPSXre8NEk9k_fNrpO4xnZ_LkUsoYFcV-P_2Qdb4qNbH06p9z2rYIIIsm7bFrnIja1Gfus3L4IFDDECy26ZVYAwLdBQy9l5Qm0Bv9JIUODR4sFp4ImHEbCYeKRn2lTcvM5AdVBVvuN-dvvJm-ge3Xu8BJDlbxJgKLbjRzAZcqn8ybCqDQ4X5gpj_Y1lQrXqNSqeuujRNCrQJgA";
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
  if (allowedActions.includes("SIN-R-TST")) {
    return "Insurance Testing";
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
  } else if (allowedActions.includes("SIN-R-CHEMO")) {
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