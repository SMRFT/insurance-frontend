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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiTURDLVAtR1NQLVIiLCJNREMtUC1HQVAtUiIsIlNELVAtTEJOLVIiLCJTRC1QLVNTVS1SVyIsIk1EQy1BUEktQVQtUlciLCJNREMtQVBJLUFETS1SVyIsIlNJTi1QLUZVLVJXIiwiSE1TLVAtT1BQLVJXIiwiR1AtUC1HQ04tUiIsIk1EQy1BUEktUEFUIiwiTURDLUFQSS1USFItUiIsIkhNUy1QLVZJTiIsIlNELVAtTFBJLVIiLCJNREMtQVBJLVBBVC1SIiwiU1QtUC1UREwtUiIsIlNULVAtREVTLVIiLCJTRC1QLVNQLVIiLCJNREMtUC1QTlAtUlciLCJNREMtQVBJLUxCTi1SIiwiU1QtUC1CUkQtUiIsIkhNUy1QLVZJTlIiLCJTRC1QLVBHLVJXIiwiU0QtUC1VUEItUlciLCJTRC1QLUxSQy1SIiwiTURDLUFQSS1SVFMtUiIsIk1EQy1BUEktUERDLVJXIiwiU1QtUC1DTVQtUlciLCJFUi1QLUVSQi1SVyIsIlNELVAtR1BCLVIiLCJTRC1QLUxCQy1SVyIsIk1EQy1QLVNPUi1SIiwiRVItUC1FUkRMLVIiLCJFUi1QLUVSUkVQLVJXIiwiU0QtQVBJLVNTLVJXIiwiSE1TLVAtQURELVJXIiwiTURDLVAtVFJCLVJXIiwiTURDLUFQSS1HQVMtUiIsIlNULVAtTlRGLVIiLCJTRC1QLVNTLVJXIiwiTURDLUFQSS1SREwtUlciLCJNREMtQVBJLVNHUC1SVyIsIlNELVAtTFRNLVJXIiwiRVItUC1FUlBMLVIiLCJNREMtQVBJLVBHUC1SVyIsIlNJTi1QLUVOUS1SVyIsIkVSLVAtRVJHTkJOLVIiLCJTVC1QLVRETC1SVyIsIlNULVAtREVTLVJXIiwiTURDLVAtQUFVLVJXIiwiU0lOLVAtRlVBLVJXIiwiSE1TLVAtQUlOLVJXIiwiTURDLVAtR1BQLVIiLCJNREMtQVBJLUFULVIiLCJTVC1BUEktQU1DLVJXIiwiTURDLVAtUkVHLVJXIiwiU0lOLVAtRU5RTC1SVyIsIk1EQy1QLUFTTS1SVyIsIlNELVAtU1MtUiIsIk1EQy1QLUdPUC1SIiwiU0QtUC1SQi1SVyIsIk1EQy1SLUFETSIsIlNELVAtR1BELVIiLCJFUi1SLUVSTiIsIk1EQy1BUEktQ0dQLVJXIiwiU0QtUC1CQS1SVyIsIlNULVAtU05PLVJXIiwiU0lOLVItTUFSIiwiU1QtQVBJLUNSRC1SVyIsIlNELVAtQkctUlciLCJTRC1QLUdTUC1SIiwiU0QtQVBJLVJCLVIiLCJTRC1QLVBPVi1SVyIsIlNULUFQSS1CUkQtUlciLCJITVMtUC1TUk0tUlciLCJNREMtUC1QTlBSLVIiLCJITVMtUC1ETEQtUlciLCJNREMtUC1QTlAtUiIsIlNULUFQSS1FTVAtUiIsIlNELVAtU0MtUiIsIlNULVAtTlRGLVJXIiwiTURDLVAtT1NCLVJXIiwiU0QtQVBJLUNOLVIiLCJTRC1BUEktVE0tUlciLCJNREMtUC1HQ1AtUiIsIlNELUFQSS1URC1SIiwiRVItUC1FUlBCLVJXIiwiU0QtUC1QQi1SVyIsIlNELVAtQlRELVJXIiwiSE1TLVAtQURNLVJXIiwiU1QtUi1IT0QiLCJITVMtUi1OUyIsIkhNUy1QLVZWIiwiTURDLUFQSS1BR1AtUlciLCJNREMtUC1SRUctUiIsIlNELVAtUEYtUlciLCJNREMtQVBJLUNEUi1SIiwiTURDLUFQSS1PR1AtUlciLCJTVC1QLUNNVC1SIiwiU0QtUi1TTUMiXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJob3NwaXRhbF9jb2RlIjoiU0gwMDEiLCJobXNfcGFnZXMiOls0MCw0MSw0Miw0Nl0sImFsbG93ZWQtb3V0bGV0cyI6W10sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzgwNDcxNTU3LCJleHAiOjE3ODA1NTg1NTd9.D_pmQ26ccCKVmFReXInuMz5RpIDKnl3aAYOhUMN9Z3gvSUvDrBqyjWOw-rER_2xBHagDxJ9EHk1Fry7i8Wd5hE3j_mzL9fHDYThWzS5jzDOxOivccC-8HkhwU7aU5hsUtO5o6-lWH2XczPm9THeeplP8vINaAuii5-95er9hmXpaqbGxnpMsS7__byFvkT2rl6ZCCQQfRis4LuIIfGCcgC4S4O7wUm5cc1kpt4amUqnJDRZNGwnsBPFZIzh1LG5AtO_44xUdmvUWQEzn9MzDxynITVPuLpgInborUHQ35BBMvzClVlavNuDdruKv5KSVrUPwshlSTWuPv76wAYWxHQ";
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