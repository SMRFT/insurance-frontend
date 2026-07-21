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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiTURDLVAtR1NQLVIiLCJTVC1QLUNNVC1SIiwiU0QtQVBJLVJCLVJXIiwiU1QtUC1OVEYtUiIsIkVSLVAtRVJCLVJXIiwiU0QtUC1CQS1SVyIsIlNULUFQSS1FTVAtUiIsIk1EQy1BUEktUEFULVIiLCJTSU4tUC1GQS1SVyIsIlNELVAtTEJMLVJXIiwiRVItUC1FUlBMLVIiLCJITVMtUC1WSU5SLVIiLCJNREMtUC1BRC1SIiwiU0QtUC1TQy1SIiwiTURDLUFQSS1SREwtUlciLCJNREMtUC1SRUctUiIsIlNJTi1QLUVOUUwtUlciLCJTRC1QLVVQQi1SVyIsIk1EQy1QLU9TQi1SVyIsIk1EQy1QLVBOUC1SVyIsIlNJTi1BUEktT1ItUlciLCJNREMtUC1QTlAtUiIsIlNULVAtREVTLVJXIiwiU0QtUC1MUkMtUiIsIlNELVAtUEYtUlciLCJTSU4tQVBJLVNGLVIiLCJFUi1QLUVSUEItUlciLCJTVC1QLVNOTy1SVyIsIkdQLVAtR0NOLVIiLCJTVC1QLVRETC1SIiwiTURDLUFQSS1BVC1SVyIsIlNELVAtU1NVLVJXIiwiTURDLVAtR1BQLVIiLCJNREMtQVBJLUFHUC1SVyIsIk1EQy1QLVBOUFItUiIsIlNJTi1BUEktSUYtUlciLCJTSU4tUC1HREwtUlciLCJTRC1QLUJURC1SVyIsIlNJTi1QLVJBVS1SVyIsIlNELVAtU1MtUiIsIlNELUFQSS1URC1SIiwiTURDLUFQSS1USFItUiIsIkVSLVAtRVJSRVAtUlciLCJFUi1SLUVSTiIsIk1EQy1BUEktQ0dQLVJXIiwiSE1TLVItTlMiLCJNREMtQVBJLVBHUC1SVyIsIlNJTi1BUEktRlUtUlciLCJNREMtUi1BRE0iLCJNREMtUC1HQ1AtUiIsIkhNUy1QLUFETS1SVyIsIlNELVAtUEItUlciLCJITVMtUC1WVlAiLCJNREMtUC1HT1AtUiIsIlNJTi1BUEktT1JSLVIiLCJNREMtQVBJLUNEUi1SIiwiU1QtUC1ERVMtUiIsIk1EQy1QLVJFRy1SVyIsIk1EQy1QLVNPUi1SIiwiU1QtQVBJLUJSRC1SVyIsIk1EQy1QLUFTTS1SVyIsIk1EQy1BUEktUEFUIiwiU0QtQVBJLVRNLVJXIiwiTURDLUFQSS1MQk4tUiIsIk1EQy1QLUdBVC1SIiwiU0QtUC1HU1AtUiIsIk1EQy1BUEktR0FTLVIiLCJTSU4tUC1SQS1SVyIsIlNELVAtTEJGLVJXIiwiSE1TLVAtQUlOLVJXIiwiU0QtQVBJLVNTLVJXIiwiU0QtUC1TUC1SIiwiTURDLVAtQUFVLVJXIiwiU1QtUC1OVEYtUlciLCJTRC1QLUJHLVJXIiwiTURDLUFQSS1SVFMtUiIsIk1EQy1BUEktU0dQLVJXIiwiU0QtUC1SQi1SVyIsIlNELVAtUE9WLVJXIiwiU0QtUC1QRy1SVyIsIkVSLVAtRVJHTkJOLVIiLCJITVMtUC1PUFAtUlciLCJTSU4tUC1HSUMtUiIsIlNULVAtQlJELVIiLCJTSU4tUC1GVUEtUlciLCJTRC1QLUxCTi1SIiwiU0QtUC1MQ0MtUlciLCJTSU4tUC1DRi1SIiwiTURDLUFQSS1BVC1SIiwiU0QtUC1MQkMtUlciLCJTRC1QLUdQRC1SIiwiU0lOLVItVFNUIiwiU0QtUi1TTUMiLCJTVC1QLVRETC1SVyIsIlNELVAtR1BCLVIiLCJNREMtQVBJLVBEQy1SVyIsIkhNUy1QLUFERC1SVyIsIkVSLVAtRVJETC1SIiwiTURDLVAtR0FQLVIiLCJTRC1QLVNTLVJXIiwiU0QtUC1MVE0tUlciLCJTSU4tUC1GVS1SVyIsIlNULUFQSS1DUkQtUlciLCJTRC1BUEktQ04tUlciLCJTVC1QLUNNVC1SVyIsIkhNUy1QLURMRC1SVyIsIlNJTi1QLU9QLVJXIiwiTURDLUFQSS1MLVJXIiwiU1QtUi1IT0QiLCJNREMtUC1HT0EtUlciLCJNREMtUC1UUkItUlciLCJTRC1QLUxHRS1SVyIsIlNULUFQSS1BTUMtUlciLCJTSU4tUC1FTlEtUlciLCJITVMtUC1TUk0tUlciLCJNREMtQVBJLU9HUC1SVyIsIk1EQy1BUEktQURNLVJXIiwiU0QtUC1MUEktUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6WzQ2XSwiYWxsb3dlZC1vdXRsZXRzIjpbIk9MRVQwMDUiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODQ2MzM1ODcsImV4cCI6MTc4NDcyMDU4N30.ONigvvQgQ0rjLU0IDRfrcDfq-QmIjPlXNR-wG-7XlSAXwe3X6Qc0MEdYeRwMbBjqlUVEBkkbTXDBpza3qxOAHoYiWFDKmIuqo22Qm_R_gLHc-8AzCv7ovkJC5VFo-aBCMX9KbpV8AC0s8gfYMmkcV6BcGmo0v4CtCeTfSZq3V6xcvnRzujygu5UNYWUr-F7qO_X4PuYkEHmPIL4EN-3kkgnbcVnsrOWzDvEsIXz44Sz4cO0OQzVmKrXOdNmoYjfqmyHhvTTYqJGfh6PGf2CZvAEqX_2qN2nNxp_pYkIvlR9O-AWrfzzN_ze3O3tJwIT11_lsfTDN9Ei1Tp31ub0MRg";
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