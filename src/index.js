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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0lOLVAtQ0hFLVJXIiwiU0QtQVBJLUNOLVJXIiwiSE1TLVAtQUlOLVJXIiwiU0QtUC1HUEItUiIsIk1EQy1QLVRSQi1SVyIsIlNULVAtVERMLVJXIiwiU0QtUC1VUEItUlciLCJTRC1QLUxHRS1SVyIsIlNELVAtTEJGLVJXIiwiU1QtUC1DTVQtUlciLCJNREMtUC1HUFAtUiIsIlNULVAtQlJELVIiLCJTRC1QLVBCLVJXIiwiSE1TLVAtRExELVJXIiwiTURDLVAtR0NQLVIiLCJNREMtQVBJLUwtUlciLCJITVMtUC1BRE0tUlciLCJNREMtQVBJLVJUUy1SIiwiU0lOLUFQSS1HSUMtUiIsIk1EQy1QLVBOUC1SIiwiSE1TLVAtU1JNLVJXIiwiRVItUC1FUkItUlciLCJNREMtUC1HT1AtUiIsIlNULUFQSS1CUkQtUlciLCJNREMtUC1BRC1SIiwiU0QtQVBJLVRNLVJXIiwiTURDLUFQSS1BRE0tUlciLCJFUi1QLUVSUkVQLVJXIiwiU1QtQVBJLUFNQy1SVyIsIkhNUy1SLU5TIiwiU1QtUC1UREwtUiIsIkhNUy1QLUFERC1SVyIsIkVSLVAtRVJETC1SIiwiTURDLUFQSS1TR1AtUlciLCJNREMtQVBJLUFULVJXIiwiU1QtQVBJLUNSRC1SVyIsIk1EQy1BUEktUEdQLVJXIiwiU0QtQVBJLVJCLVJXIiwiU0QtUC1MUEktUiIsIk1EQy1BUEktVEhSLVIiLCJFUi1QLUVSUEwtUiIsIlNULVItSE9EIiwiTURDLUFQSS1PR1AtUlciLCJTRC1QLVNTVS1SVyIsIlNELVAtQlRELVJXIiwiU1QtUC1OVEYtUlciLCJNREMtQVBJLVJETC1SVyIsIk1EQy1BUEktTEJOLVIiLCJNREMtQVBJLUFULVIiLCJTVC1QLU5URi1SIiwiTURDLUFQSS1QREMtUlciLCJTSU4tUi1DSEUiLCJITVMtUC1WSU5SLVIiLCJTRC1QLUxCTi1SIiwiU0QtUC1QT1YtUlciLCJNREMtQVBJLUFHUC1SVyIsIlNULVAtQ01ULVIiLCJFUi1QLUVSUEItUlciLCJHUC1QLUdDTi1SIiwiU0QtUC1TUy1SIiwiTURDLVAtUkVHLVIiLCJTRC1QLUxUTS1SVyIsIkVSLVItRVJOIiwiSE1TLVAtVlZQIiwiTURDLVAtUE5QLVJXIiwiTURDLVAtQUFVLVJXIiwiU1QtQVBJLUVNUC1SIiwiU0QtUC1QRi1SVyIsIk1EQy1BUEktQ0RSLVIiLCJNREMtUC1PU0ItUlciLCJTRC1QLUdTUC1SIiwiTURDLVAtUkVHLVJXIiwiU0QtUi1TTUMiLCJNREMtUC1HU1AtUiIsIk1EQy1QLUFTTS1SVyIsIlNELUFQSS1URC1SIiwiTURDLVAtU09SLVIiLCJTRC1QLVNTLVJXIiwiU1QtUC1TTk8tUlciLCJTVC1QLURFUy1SVyIsIlNELVAtU0MtUiIsIlNELUFQSS1TUy1SVyIsIk1EQy1QLVBOUFItUiIsIk1EQy1BUEktQ0dQLVJXIiwiU0QtUC1CRy1SVyIsIk1EQy1QLUdPQS1SVyIsIlNELVAtQkEtUlciLCJTRC1QLVJCLVJXIiwiTURDLUFQSS1QQVQtUiIsIk1EQy1BUEktR0FTLVIiLCJTRC1QLVBHLVJXIiwiU1QtUC1ERVMtUiIsIlNELVAtTFJDLVIiLCJFUi1QLUVSR05CTi1SIiwiTURDLVItQURNIiwiTURDLUFQSS1QQVQiLCJNREMtUC1HQVAtUiIsIkhNUy1QLU9QUC1SVyIsIlNELVAtU1AtUiIsIk1EQy1QLUdBVC1SIiwiU0QtUC1HUEQtUiIsIlNELVAtTEJDLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbNDZdLCJhbGxvd2VkLW91dGxldHMiOlsiT0xFVDAwNSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc4NDAwNDIxNywiZXhwIjoxNzg0MDkxMjE3fQ.b8blIrQepYkiYDLfcv8Db7T0xxFZUGapYXkq1DO6ECzMknyLWNlIjn1x02NH1ec8wQwbU_XF3QwP2VNkZvjhOigRQ0dIv7Usplm1tp0Fd-QxzZmz4TU9wyFZtIJOwNQX2ZP6UywyNPpsKmEIvKpkyESE9MtRom4naH6ww_WtdiRROXCCBZFNcPdQz0B_U8wid-gmgsW-VekE3UDvdLyeoYJJ-gfowa0-DuCHzrm2k4KcHjzYtmILviQ4z2Qo2XhaHiTYsQ6-v8I0V5wZWo4qvjjr6y9shp5NZYoG7_nSNM6Y7lfkU6ALkjGCA3RGea1gnjtYaIXJu0zt8IZ132iDsA";
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