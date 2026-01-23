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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiIiwiU0QtUC1HU1AtUiIsIk1EQy1BUEktQ0dQLVJXIiwiU0QtUC1CQkEtUlciLCJNREMtUC1SRUctUlciLCJTSU4tQVBJLVNGLVIiLCJTRC1QLUxTRC1SVyIsIlNELVAtTFVTQ0QtUlciLCJNREMtQVBJLUFULVIiLCJTRC1QLUdQRC1SIiwiTURDLVAtU09SLVIiLCJFUi1QLUVSUEItUlciLCJITVMtUi1QSCIsIlNELVAtTFRBLVJXIiwiTURDLVAtR1BQLVIiLCJTVC1QLU5URi1SIiwiRVItUC1FUkRMLVIiLCJTRC1QLVNWRC1SIiwiU0QtUC1TUy1SVyIsIk1EQy1BUEktU0dQLVJXIiwiU0QtUC1TQ1UtUiIsIlNULVAtU05PLVJXIiwiTURDLVAtR09QLVIiLCJTRC1BUEktSVZNLVJXIiwiTURDLUFQSS1QQVQiLCJTVC1QLUNNVC1SIiwiU0QtUi1HTSIsIk1EQy1QLVBOUC1SVyIsIlNELVAtUE9WLVJXIiwiRVItUC1FUkdOQk4tUiIsIlNELVAtT0QtUiIsIlNELVAtTEdMRC1SIiwiTURDLVAtQUFVLVJXIiwiU0QtUC1QT1YtUiIsIlNELVAtU0dFLVIiLCJTRC1QLUNMLVJXIiwiU0QtQVBJLVJCLVIiLCJTVC1QLURFUy1SVyIsIlNELVAtTEQtUiIsIk1EQy1BUEktUEdQLVJXIiwiU1QtUC1OVEYtUlciLCJITVMtUC1DUy1SVyIsIlNELVAtUkQtUlciLCJTRC1QLVNDLVIiLCJTVC1QLVRETC1SIiwiTURDLVAtUkVHLVIiLCJNREMtUC1PU0ItUlciLCJNREMtQVBJLU9HUC1SVyIsIk1EQy1BUEktUERDLVJXIiwiU0QtUC1CRy1SIiwiSE1TLVAtSFNOLVJXIiwiU0lOLUFQSS1PUlItUiIsIlNELVAtTFNDTC1SIiwiTURDLUFQSS1MQk4tUiIsIlNELVAtTFJDLVIiLCJNREMtUC1BU00tUlciLCJITVMtUC1WTC1SVyIsIlNELUFQSS1UTS1SIiwiU0QtUC1MR0xULVIiLCJTRC1BUEktR0QtUiIsIlNULVItQSIsIkdQLVAtR0NOLVIiLCJNREMtUC1QTlAtUiIsIk1EQy1QLUdBUC1SIiwiU1QtUC1ERVMtUiIsIlNJTi1BUEktSUYtUlciLCJNREMtUC1HQ1AtUiIsIlNELVAtTUlTLVIiLCJNREMtUC1QTlBSLVIiLCJNREMtUC1UUkItUlciLCJTRC1BUEktQ04tUiIsIk1EQy1BUEktQUdQLVJXIiwiRVItUC1FUlJFUC1SIiwiU0lOLVAtR0lDLVIiLCJFUi1QLUVSQi1SVyIsIlNELVAtVFMtUlciLCJNREMtUi1BRE0iLCJNREMtQVBJLVJETC1SVyIsIlNJTi1SLVNBIiwiU0QtQVBJLVBSLVIiLCJNREMtQVBJLUNEUi1SIiwiU0lOLUFQSS1GVS1SVyIsIlNULVAtQ01ULVJXIiwiU0QtUC1MU0MtUlciLCJTSU4tQVBJLU9SLVJXIiwiTURDLUFQSS1QQVQtUiIsIlNELUFQSS1NSVMtUlciLCJTRC1QLVNTLVIiLCJTVC1QLUJSRC1SIiwiU1QtUC1UREwtUlciLCJTRC1QLUxQSS1SIiwiU0QtUC1MR0QtUlciLCJNREMtQVBJLVRIUi1SIiwiU1QtQVBJLUVNUC1SIiwiRVItUi1FUk4iLCJNREMtQVBJLVJUUy1SIiwiU0QtUC1DSEMtUlciLCJTRC1QLUxHU0MtUiIsIlNULUFQSS1DUkQtUlciLCJNREMtQVBJLUdBUy1SIiwiTURDLUFQSS1BRE0tUlciLCJNREMtQVBJLUFULVJXIiwiRVItUC1FUlBMLVIiLCJTRC1QLUNIQy1SIiwiU1QtQVBJLUJSRC1SVyIsIlNULUFQSS1BTUMtUlciLCJNREMtUC1HU1AtUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzY5MTYzOTM1LCJleHAiOjE3NjkyNTA5MzUsImp0aSI6IjMxNzYxZDQwLTRlNTUtNDZmMy05MmZkLTc3OTA0NmRmMmUxYyJ9.KzU34KcvN_iYf3AIlo13bVmpi_AerxTvDokGT7JXsx3ZMUqtftvQXuq7ohDQjm00gP0CR-VYulgmuizgdnzPmFv3zVFWD-vOfbx6J6kJR1Z90Lrd7cP3hGEMX8C_JyfVBsamfiTJrY7dVOmvNGVOdvKYgn12472CUvTXz7c76V58akl2h8n0rGGj5ovwpgYO73yF4Blszh69gwQp3_AQ41IXh4U0hWm0oopqpamD4At1NEi3LO7kgZaeFUc0rBpJbTORgNOJzPHCJyUv7u1Ea9JOoOjy--pZtth9-GswpVV_e_mWtkHB7emju357NpDHI_z0R6AqEDdzvWuBKIeFXQ";
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
  } else if (allowedActions.includes("SIN-R-REC")) {
    return "Insurance Receptionist";
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