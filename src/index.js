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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiSE1TLVItUEgiLCJNREMtUC1SRUctUlciLCJTVC1QLUJSRC1SIiwiU0lOLVAtRkEtUlciLCJTVC1QLURFUy1SIiwiU0lOLUFQSS1TRi1SIiwiU1QtUC1OVEYtUiIsIlNELVAtR1BULVIiLCJTSU4tUC1HREwtUiIsIk1EQy1QLVNPUi1SIiwiTURDLVAtR09QLVIiLCJNREMtQVBJLUFHUC1SVyIsIk1EQy1BUEktU0dQLVJXIiwiU0lOLUFQSS1JRi1SVyIsIlNJTi1SLVNBIiwiU1QtUC1TTk8tUlciLCJNREMtQVBJLVBHUC1SVyIsIk1EQy1BUEktQVQtUiIsIk1EQy1BUEktVEhSLVIiLCJNREMtUC1HUFAtUiIsIlNULVAtQ01ULVJXIiwiU0QtUi1QSCIsIk1EQy1BUEktR0FTLVIiLCJTRC1QLVBIRC1SVyIsIlNJTi1BUEktT1JSLVIiLCJNREMtUC1BQVUtUlciLCJFUi1QLUVSR05CTi1SIiwiRVItUC1FUlBMLVIiLCJTSU4tQVBJLU9SLVJXIiwiU1QtUC1UREwtUiIsIk1EQy1QLVBOUC1SIiwiTURDLUFQSS1QQVQiLCJTVC1BUEktQ1JELVJXIiwiU1QtUi1IT0QiLCJFUi1SLUVSTiIsIk1EQy1BUEktUkRMLVJXIiwiU0QtUC1QT1YtUlciLCJTSU4tQVBJLUZVLVJXIiwiRVItUC1FUkRMLVIiLCJNREMtQVBJLU9HUC1SVyIsIk1EQy1QLVBOUFItUiIsIk1EQy1BUEktQ0dQLVJXIiwiTURDLVAtR1NQLVIiLCJTSU4tUC1HSUMtUiIsIk1EQy1QLUdBUC1SIiwiTURDLVAtUkVHLVIiLCJNREMtQVBJLUFETS1SVyIsIkhNUy1QLUhTTi1SVyIsIlNJTi1QLVJBLVJXIiwiTURDLVAtT1NCLVJXIiwiU1QtQVBJLUFNQy1SVyIsIk1EQy1SLUFETSIsIlNULVAtVERMLVJXIiwiTURDLUFQSS1QQVQtUiIsIkVSLVAtRVJQQi1SVyIsIk1EQy1BUEktTEJOLVIiLCJNREMtUC1UUkItUlciLCJTVC1QLU5URi1SVyIsIlNELVAtUEhSLVJXIiwiSE1TLVAtVkwtUlciLCJFUi1QLUVSUkVQLVJXIiwiTURDLUFQSS1QREMtUlciLCJTVC1BUEktRU1QLVIiLCJTVC1BUEktQlJELVJXIiwiR1AtUC1HQ04tUiIsIlNULVAtREVTLVJXIiwiTURDLVAtR0NQLVIiLCJTVC1QLUNNVC1SIiwiU0QtQVBJLVRNLVJXIiwiTURDLVAtQVNNLVJXIiwiTURDLVAtUE5QLVJXIiwiTURDLUFQSS1BVC1SVyIsIlNJTi1QLVJBVS1SVyIsIlNJTi1QLU9QLVJXIiwiRVItUC1FUkItUlciLCJNREMtQVBJLUNEUi1SIiwiTURDLUFQSS1SVFMtUiIsIkhNUy1QLUNTLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NzE0NzM2OTgsImV4cCI6MTc3MTU2MDY5OCwianRpIjoiYjQzMTg3ZmItOGU0ZC00ZTY2LTgxYmQtMDEwOGFiOWI1ZGVkIn0.WfjGIHMyyU99gLUs4jhojbDqfBih-voYvUuPxp3X4lUBD2bHkL9_21P3ntYx9JFEVUTf57sPlCZp1JGKGK99pujouUGkjqdexvW-1KULVxIMcmB04C92Mb-y7y3Y7a5n-qfg5-oB890WMcGFAcCb6hV_1QTmUw0YcXxkzieMx-0aucgNxJUiKMXqZULodnSLyeJHI4DYAo2one2j3YZB0o5HQos1-QbbkIuuGDt-TmnhCvoONFLN_h4Gelv6joNDt_AA7fo0_ohm37aw2BcWzkZINAXZVlr-GLxcDky31q9gKTX42jS2MIb2q_5ACBeeN6wO0e67Zpbq5UPYJoYGAQ";
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