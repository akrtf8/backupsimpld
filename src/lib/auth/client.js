"use client";

import axios from "axios";

// Function to generate a random token
function generateToken() {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, "0")).join("");
}

// Mock user data
const user = {
  id: "USR-000",
  avatar: "/assets/avatar.png",
  firstName: "admin",
  lastName: "simpld",
  email: "admin@simpld.in",
};

// AuthClient class for handling authentication
class AuthClient {
  // Sign up function
  async signUp(params) {
    // Mock implementation: generate a token and save it in localStorage
    const token = generateToken();
    localStorage.setItem("simpld-auth-token", token);

    return { error: null };
  }

  // Social login placeholder (not implemented)
  async signInWithOAuth(params) {
    return { error: "Social authentication not implemented" };
  }

  // Sign in with email and password
  async signInWithPassword({ email, password }) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
        { username: email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { data } = response.data;
      if (data.token) {
        // Store the token securely
        localStorage.setItem("simpld-auth-token", data.token);
      }

      return { data, error: null };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "API login error:",
          error.response?.data || error.message
        );
        return {
          error:
            error.response?.data?.message || "Invalid credentials or API error",
        };
      } else {
        console.error("Unexpected error:", error);
        return { error: "An unexpected error occurred" };
      }
    }
  }

  // Reset password placeholder
  async resetPassword(params) {
    return { error: "Password reset not implemented" };
  }

  // Update password placeholder
  async updatePassword(params) {
    return { error: "Password update not implemented" };
  }

  // Get user details from token
  async getUser() {
    const token = localStorage.getItem("simpld-auth-token");
    if (!token) {
      return { data: null, error: null };
    }
    return { data: user, error: null };
  }

  // Sign out function
  async signOut() {
    localStorage.removeItem("simpld-auth-token");
    return { error: null };
  }
}

// Export a singleton instance of AuthClient
const authClient = new AuthClient();
export default authClient;
