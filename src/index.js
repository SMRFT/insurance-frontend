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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiTURDLVAtR1NQLVIiLCJTVC1QLUNNVC1SIiwiU0QtQVBJLVJCLVJXIiwiU1QtUC1OVEYtUiIsIkVSLVAtRVJCLVJXIiwiU0QtUC1CQS1SVyIsIlNULUFQSS1FTVAtUiIsIk1EQy1BUEktUEFULVIiLCJTSU4tUC1GQS1SVyIsIlNJTi1QLVJULVJXIiwiU0QtUC1MQkwtUlciLCJFUi1QLUVSUEwtUiIsIkhNUy1QLVZJTlItUiIsIk1EQy1QLUFELVIiLCJTRC1QLVNDLVIiLCJNREMtQVBJLVJETC1SVyIsIk1EQy1QLVJFRy1SIiwiU0lOLVAtRU5RTC1SVyIsIlNELVAtVVBCLVJXIiwiTURDLVAtT1NCLVJXIiwiTURDLVAtUE5QLVJXIiwiU0lOLUFQSS1PUi1SVyIsIk1EQy1QLVBOUC1SIiwiU1QtUC1ERVMtUlciLCJTSU4tUC1DSEVBLVJXIiwiU0QtUC1MUkMtUiIsIlNELVAtUEYtUlciLCJFUi1QLUVSUEItUlciLCJTVC1QLVNOTy1SVyIsIkdQLVAtR0NOLVIiLCJTSU4tUC1DSEUtUlciLCJTVC1QLVRETC1SIiwiTURDLUFQSS1BVC1SVyIsIlNJTi1BUEktR0lDLVIiLCJTRC1QLVNTVS1SVyIsIk1EQy1QLUdQUC1SIiwiTURDLUFQSS1BR1AtUlciLCJNREMtUC1QTlBSLVIiLCJTSU4tUi1BVlAiLCJTSU4tQVBJLUlGLVJXIiwiU0lOLVAtR0RMLVJXIiwiU0QtUC1CVEQtUlciLCJTSU4tUC1SQVUtUlciLCJTRC1QLVNTLVIiLCJTRC1BUEktVEQtUiIsIlNJTi1QLVJUQS1SVyIsIk1EQy1BUEktVEhSLVIiLCJFUi1QLUVSUkVQLVJXIiwiRVItUi1FUk4iLCJNREMtQVBJLUNHUC1SVyIsIkhNUy1SLU5TIiwiTURDLUFQSS1QR1AtUlciLCJTSU4tQVBJLUZVLVJXIiwiTURDLVItQURNIiwiTURDLVAtR0NQLVIiLCJITVMtUC1BRE0tUlciLCJTRC1QLVBCLVJXIiwiSE1TLVAtVlZQIiwiTURDLVAtR09QLVIiLCJTSU4tQVBJLU9SUi1SIiwiTURDLUFQSS1DRFItUiIsIlNULVAtREVTLVIiLCJNREMtUC1SRUctUlciLCJNREMtUC1TT1ItUiIsIlNULUFQSS1CUkQtUlciLCJNREMtUC1BU00tUlciLCJNREMtQVBJLVBBVCIsIlNELUFQSS1UTS1SVyIsIk1EQy1BUEktTEJOLVIiLCJNREMtUC1HQVQtUiIsIlNELVAtR1NQLVIiLCJNREMtQVBJLUdBUy1SIiwiU0lOLVAtUkEtUlciLCJTRC1QLUxCRi1SVyIsIkhNUy1QLUFJTi1SVyIsIlNELUFQSS1TUy1SVyIsIlNJTi1BUEktU0YtUlciLCJTRC1QLVNQLVIiLCJNREMtUC1BQVUtUlciLCJTVC1QLU5URi1SVyIsIlNELVAtQkctUlciLCJNREMtQVBJLVJUUy1SIiwiTURDLUFQSS1TR1AtUlciLCJTRC1QLVJCLVJXIiwiU0QtUC1QT1YtUlciLCJTRC1QLVBHLVJXIiwiRVItUC1FUkdOQk4tUiIsIkhNUy1QLU9QUC1SVyIsIlNULVAtQlJELVIiLCJTSU4tUC1GVUEtUlciLCJTRC1QLUxCTi1SIiwiU0QtUC1MQ0MtUlciLCJTSU4tUC1DRi1SIiwiTURDLUFQSS1BVC1SIiwiU0QtUC1MQkMtUlciLCJTRC1QLUdQRC1SIiwiU0QtUi1TTUMiLCJTVC1QLVRETC1SVyIsIlNELVAtR1BCLVIiLCJNREMtQVBJLVBEQy1SVyIsIkhNUy1QLUFERC1SVyIsIkVSLVAtRVJETC1SIiwiTURDLVAtR0FQLVIiLCJTRC1QLVNTLVJXIiwiU0QtUC1MVE0tUlciLCJTSU4tUC1GVS1SVyIsIlNULUFQSS1DUkQtUlciLCJTRC1BUEktQ04tUlciLCJTVC1QLUNNVC1SVyIsIkhNUy1QLURMRC1SVyIsIlNJTi1QLU9QLVJXIiwiTURDLUFQSS1MLVJXIiwiU1QtUi1IT0QiLCJNREMtUC1HT0EtUlciLCJNREMtUC1UUkItUlciLCJTRC1QLUxHRS1SVyIsIlNULUFQSS1BTUMtUlciLCJTSU4tUC1FTlEtUlciLCJITVMtUC1TUk0tUlciLCJNREMtQVBJLU9HUC1SVyIsIk1EQy1BUEktQURNLVJXIiwiU0QtUC1MUEktUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6WzQ2XSwiYWxsb3dlZC1vdXRsZXRzIjpbIk9MRVQwMDUiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODQ3ODAyMzYsImV4cCI6MTc4NDg2NzIzNn0.XKZlxtbs0a7hUH7T0RfLDl8m6VfjNmLwq5TGO0L_BLWwtVt83bYWN8y8Cwt4V4Hwnf12leC7WyeaNa-n_2P_9A-UCkVgqnqiY1SIo9PajvRvnesmnaCHdsPK_pa6uIz9D9Oz6xrmznSxqcJ8ErRYp-h3cueWQ3K0j_Q-c6dxytI7nk-s-xaT82Lc4jDnAEvFuZx6Oh4GMyc5FqxERD_h5z0nFbFJ3gA6FPMOv2qrs7YzsON-LryvbEjTPRWsFc-nMwoG5kROSN-D1DdO7hYd7bTgvra74fnNFfFtIJPeRZJMC8AIBpBjqgBfwHM3cJln4tqzpcYzYy7qJF2igCDAsQ";
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