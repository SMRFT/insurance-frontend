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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiTURDLVAtUkVHLVJXIiwiU1QtUC1CUkQtUiIsIlNELVAtTUlTLVIiLCJTRC1BUEktQ04tUiIsIlNJTi1QLUZBLVJXIiwiU0QtUC1TUy1SVyIsIlNULVAtREVTLVIiLCJTSU4tQVBJLVNGLVIiLCJTVC1QLU5URi1SIiwiU0lOLVAtR0RMLVIiLCJNREMtUC1TT1ItUiIsIlNELVAtVEQtUiIsIlNELVAtUEQtUiIsIk1EQy1QLUdPUC1SIiwiU0QtUC1CVEQtUlciLCJNREMtQVBJLUFHUC1SVyIsIlNELVAtQ0hDLVIiLCJNREMtQVBJLVNHUC1SVyIsIlNJTi1BUEktSUYtUlciLCJTSU4tUi1TQSIsIlNULVAtU05PLVJXIiwiU0QtUC1TU1UtUiIsIlNELVAtQ0hDLVJXIiwiTURDLUFQSS1QR1AtUlciLCJNREMtQVBJLUFULVIiLCJNREMtQVBJLVRIUi1SIiwiTURDLVAtR1BQLVIiLCJTVC1QLUNNVC1SVyIsIk1EQy1BUEktR0FTLVIiLCJTSU4tQVBJLU9SUi1SIiwiSE1TLVAtQURNLVJXIiwiTURDLVAtQUFVLVJXIiwiRVItUC1FUkdOQk4tUiIsIkVSLVAtRVJQTC1SIiwiU0lOLUFQSS1PUi1SVyIsIlNELVAtUE9WLVIiLCJTVC1QLVRETC1SIiwiTURDLVAtUE5QLVIiLCJNREMtQVBJLVBBVCIsIlNELVItQ0VPIiwiU1QtQVBJLUNSRC1SVyIsIlNULVItSE9EIiwiRVItUi1FUk4iLCJNREMtQVBJLVJETC1SVyIsIlNELVAtUE9WLVJXIiwiU0lOLUFQSS1GVS1SVyIsIlNELUFQSS1SQi1SIiwiRVItUC1FUkRMLVIiLCJNREMtQVBJLU9HUC1SVyIsIlNELVAtREYtUiIsIkhNUy1QLUFJTi1SVyIsIk1EQy1QLVBOUFItUiIsIkhNUy1QLU9QUC1SVyIsIlNELVAtREYtUlciLCJNREMtQVBJLUNHUC1SVyIsIk1EQy1QLUdTUC1SIiwiU0lOLVAtR0lDLVIiLCJNREMtUC1HQVAtUiIsIlNELVAtQlRELVIiLCJTRC1BUEktVFYtUiIsIlNELVAtU1MtUiIsIk1EQy1QLVJFRy1SIiwiTURDLUFQSS1BRE0tUlciLCJNREMtUC1PU0ItUlciLCJTSU4tUC1SQS1SVyIsIlNULUFQSS1BTUMtUlciLCJITVMtUC1ETEQtUlciLCJNREMtUi1BRE0iLCJTRC1BUEktVE0tUiIsIlNULVAtVERMLVJXIiwiTURDLUFQSS1QQVQtUiIsIlNELVAtUEwtUiIsIkVSLVAtRVJQQi1SVyIsIk1EQy1BUEktTEJOLVIiLCJNREMtUC1UUkItUlciLCJTVC1QLU5URi1SVyIsIlNELVAtVEQtUlciLCJFUi1QLUVSUkVQLVJXIiwiTURDLUFQSS1QREMtUlciLCJTVC1BUEktRU1QLVIiLCJTVC1BUEktQlJELVJXIiwiU0QtUC1HUEQtUiIsIkdQLVAtR0NOLVIiLCJTVC1QLURFUy1SVyIsIkhNUy1QLVNSTS1SVyIsIkhNUy1SLU5TIiwiTURDLVAtR0NQLVIiLCJTVC1QLUNNVC1SIiwiU0QtUC1CRy1SIiwiU0QtQVBJLVRELVIiLCJNREMtUC1BU00tUlciLCJNREMtUC1QTlAtUlciLCJNREMtQVBJLUFULVJXIiwiU0QtUC1TQ1UtUlciLCJTRC1QLVNTVS1SVyIsIlNJTi1QLVJBVS1SVyIsIlNJTi1QLU9QLVJXIiwiSE1TLVAtQURELVJXIiwiRVItUC1FUkItUlciLCJNREMtQVBJLUNEUi1SIiwiTURDLUFQSS1SVFMtUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzc0MDY5ODU2LCJleHAiOjE3NzQxNTY4NTYsImp0aSI6IjU5ZTM3Yzc0LTBmOWEtNDRhMi1iYTI5LWQ1NTI1YzY4YmYwZSJ9.eI7nWhgWbK2vJ-GRRFRh756rsOcxNPyDnel-29hjv5L2LMP9fm7P-cOQc9dherKEGn2vX6nIdPf7WB6EvxZRJ9M_kBmA_xRHIgMwAwfrbCweIfmht17X1S-rx1s62zTZ8q2L86u-3b1O8CJjh_fMUV3bNUhrmsWWivCobhRcwO4kyryg8EJ8K_R3rnM3AqTgWTlSVzMyuB44WDdt_26kEfAOlHVRUAl90DEQOkJD-tRUQVkaJexnapXGnxq81i8Z8Ln3A1pa5eTx2iDB3bj2udrtrzeMsbfHfntPBO84vp6-ZIuhN4Pc6TynS55ogqrxHvGp2td3gKoYbb8BVwKVRA";
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