import React, {
  createContext,
  useState,
  useEffect,
} from "react";

import API from "@/services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] =
    useState(null);

  const [initialLoading, setInitialLoading] =
    useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    setInitialLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      if (!res.data.success) {
        return {
          success: false,
          error: res.data.message,
        };
      }

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setCurrentUser(res.data.user);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // SIGNUP
  const signup = async (
    name,
    email,
    password
  ) => {
    try {
      const res = await API.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      if (!res.data.success) {
        return {
          success: false,
          error: res.data.message,
        };
      }

      // Auto login after signup
      return await login(email, password);
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Signup failed",
      };
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setCurrentUser(null);
  };

  const value = {
    currentUser,
    initialLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
  };

  if (initialLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
