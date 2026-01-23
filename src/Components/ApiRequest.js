import axios from "axios";

/**
 * Reusable API request helper with token authentication
 * @param {string} url - The API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {Object|FormData|null} data - Request body data
 * @param {Object} headers - Additional headers to merge with defaults
 * @param {Object} extraConfig - Additional axios configuration (like params)
 * @returns {Promise<Object>} - Returns { success: boolean, data?: any, error?: string, status?: number }
 */
const apiRequest = async (
  url,
  method = "GET",
  data = null,
  headers = {},
  extraConfig = {}
) => {
  try {
    const token = localStorage.getItem("access_token");

    // Decide content type automatically
    const isFormData = data instanceof FormData;

    const defaultHeaders = {
      Authorization: token,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    const config = {
      method,
      url,
      headers: { ...defaultHeaders, ...headers },
      validateStatus: () => true,
      ...extraConfig,
    };

    if (data && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      config.data = data;
    }

    const response = await axios(config);

    if (response.status >= 200 && response.status < 300) {
      return { success: true, data: response.data, status: response.status };
    } else if (response.status >= 400 && response.status < 500) {
      const backendError = response.data?.error || response.data?.message;
      return {
        success: false,
        error: backendError || `Client error (${response.status})`,
        status: response.status,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: "Unexpected response from server.",
        status: response.status,
        data: response.data,
      };
    }
  } catch (error) {
    console.error("Network or unexpected error:", error);
    return {
      success: false,
      error: "Network error or unexpected issue occurred.",
      networkError: true,
    };
  }
};

export default apiRequest;
