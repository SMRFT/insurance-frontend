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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiSE1TLVAtQUlOLVJXIiwiU0lOLVAtT1AtUlciLCJNREMtUC1UUkItUlciLCJTVC1QLVRETC1SVyIsIlNELVAtSE1TVEQtUiIsIlNJTi1BUEktT1JSLVIiLCJTSU4tUC1GQS1SVyIsIlNELVAtSE1TR0MtUiIsIlNULVAtQ01ULVJXIiwiU0QtUC1ITVNTUC1SIiwiTURDLVAtR1BQLVIiLCJTVC1QLUJSRC1SIiwiSE1TLVAtRExELVJXIiwiU0QtUC1ITVNHUC1SIiwiTURDLVAtR0NQLVIiLCJITVMtUC1BRE0tUlciLCJTRC1SLUxUIiwiU0QtUC1SRy1SVyIsIk1EQy1BUEktUlRTLVIiLCJTRC1QLUhNU1BCLVJXIiwiTURDLVAtUE5QLVIiLCJTRC1QLU1CUEQtUiIsIkhNUy1QLVNSTS1SVyIsIkVSLVAtRVJCLVJXIiwiTURDLVAtR09QLVIiLCJTSU4tQVBJLUZVLVJXIiwiU1QtQVBJLUJSRC1SVyIsIlNELUFQSS1UTS1SVyIsIk1EQy1BUEktQURNLVJXIiwiRVItUC1FUlJFUC1SVyIsIlNULUFQSS1BTUMtUlciLCJITVMtUi1OUyIsIlNJTi1QLUZVLVJXIiwiU1QtUC1UREwtUiIsIkhNUy1QLUFERC1SVyIsIkVSLVAtRVJETC1SIiwiTURDLUFQSS1TR1AtUlciLCJNREMtQVBJLUFULVJXIiwiU1QtQVBJLUNSRC1SVyIsIk1EQy1BUEktUEdQLVJXIiwiTURDLUFQSS1USFItUiIsIlNELVAtSE1TTEQtUiIsIkVSLVAtRVJQTC1SIiwiU0QtUC1NSVMtUiIsIlNULVItSE9EIiwiU0QtQVBJLVRNLVIiLCJTRC1QLVJELVJXIiwiU0QtUC1ITVNQUy1SVyIsIk1EQy1BUEktT0dQLVJXIiwiU0QtQVBJLUdELVIiLCJTRC1QLVNTVS1SVyIsIlNJTi1SLVRTVCIsIlNELVAtU0EtUlciLCJTVC1QLU5URi1SVyIsIk1EQy1BUEktUkRMLVJXIiwiTURDLUFQSS1MQk4tUiIsIlNELUFQSS1SQi1SIiwiTURDLUFQSS1BVC1SIiwiU1QtUC1OVEYtUiIsIk1EQy1BUEktUERDLVJXIiwiU0QtUC1TU1UtUiIsIkhNUy1QLVZJTlItUiIsIlNELVAtUE9WLVJXIiwiTURDLUFQSS1BR1AtUlciLCJTSU4tUC1SQS1SVyIsIlNULVAtQ01ULVIiLCJFUi1QLUVSUEItUlciLCJHUC1QLUdDTi1SIiwiU0QtUC1TUy1SIiwiTURDLVAtUkVHLVIiLCJTRC1BUEktTUlTLVJXIiwiRVItUi1FUk4iLCJTRC1BUEktTUJURC1SVyIsIlNJTi1QLUdETC1SVyIsIlNJTi1QLVJBVS1SVyIsIkhNUy1QLVZWUCIsIk1EQy1QLVBOUC1SVyIsIk1EQy1QLUFBVS1SVyIsIlNULUFQSS1FTVAtUiIsIlNELVAtVERFLVJXIiwiTURDLUFQSS1DRFItUiIsIk1EQy1QLU9TQi1SVyIsIk1EQy1QLVJFRy1SVyIsIlNJTi1BUEktT1ItUlciLCJTRC1QLU1CVFYtUiIsIlNELVAtSE1TVUMtUlciLCJNREMtUC1HU1AtUiIsIk1EQy1QLUFTTS1SVyIsIk1EQy1QLVNPUi1SIiwiU0QtQVBJLVRWLVIiLCJTRC1BUEktQ04tUiIsIlNELVAtVEQtUlciLCJTRC1QLVNTLVJXIiwiU1QtUC1TTk8tUlciLCJTRC1QLUhNU1NELVIiLCJTRC1QLU1CREYtUlciLCJTVC1QLURFUy1SVyIsIlNELVAtSE1TQ1MtUiIsIlNELVAtREYtUlciLCJTSU4tQVBJLUlGLVJXIiwiU0QtUC1ITVNCRC1SVyIsIk1EQy1QLVBOUFItUiIsIk1EQy1BUEktQ0dQLVJXIiwiU0QtUC1ITVNTUy1SVyIsIlNJTi1BUEktU0YtUlciLCJTSU4tUC1DRi1SIiwiTURDLUFQSS1QQVQtUiIsIk1EQy1BUEktR0FTLVIiLCJTRC1QLVRFLVJXIiwiU1QtUC1ERVMtUiIsIlNJTi1QLUdJQy1SIiwiRVItUC1FUkdOQk4tUiIsIk1EQy1SLUFETSIsIlNJTi1QLUVOUS1SVyIsIlNELVAtUEQtUlciLCJNREMtQVBJLVBBVCIsIk1EQy1QLUdBUC1SIiwiSE1TLVAtT1BQLVJXIiwiU0lOLVAtRU5RTC1SVyIsIlNELVAtUE9WLVIiLCJTSU4tUC1GVUEtUlciXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJob3NwaXRhbF9jb2RlIjoiU0gwMDEiLCJobXNfcGFnZXMiOls0Nl0sImFsbG93ZWQtb3V0bGV0cyI6WyJPTEVUMDA1Il0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzgyODEyMTUyLCJleHAiOjE3ODI4OTkxNTJ9.Tiz6gO2Wi44d3zF_XbDHh4f2X-mCaWcQ-J6QhyyoMUsLVCHjWy8YmoWO597Ij2mJr3YqXjXA4CQ8I_L6BZfO5YN-y1Sox44Bsa4nLeZB9AUsxR3gjX3pikS_De0bn9QEIieN0H9i4aPFJ-vZ2ZtVOCb7ekduTGaQYAi_3ByiXMrSy4xyrSKA7QtdiyMtZ433Ip6s3Im8HsuAhCEZpE3ITOPhdcmX_K-I11cZV5eAgkAlVLYALX1HqZHf382_Va5N9hKNwVr1FBBxO2ZRQs2bXVnHhikB4SfDKJTxQpLoFhIqhxdYYGV4d9_lkDbIblFvoQAkHmydVYjX0Vk3f7gLeg";
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