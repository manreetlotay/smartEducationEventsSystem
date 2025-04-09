import { createContext, useContext, useState, useEffect } from "react";
import {
  AuthContextType,
  AuthTokens,
  RegisterIndividualUser,
  RegisterOrganizationUser,
} from "../types/Auth";
import { User } from "../types/User";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage (first mount)
  useEffect(() => {
    const initAuth = async () => {
      const savedTokens = localStorage.getItem("auth_tokens");

      if (savedTokens) {
        try {
          const parsedTokens = JSON.parse(savedTokens);
          setTokens(parsedTokens);

          // Pass the parsed tokens directly to checkAuth instead of relying on state
          await checkAuth(parsedTokens);
        } catch (error) {
          console.error("Failed to parse saved tokens:", error);
          localStorage.removeItem("auth_tokens");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Save tokens to localStorage when they change
  useEffect(() => {
    if (tokens) {
      localStorage.setItem("auth_tokens", JSON.stringify(tokens));
    } else {
      localStorage.removeItem("auth_tokens");
    }
  }, [tokens]);

  // Check if the user is currently authenticated
  const checkAuth = async (tokensToUse = tokens) => {
    try {
      setIsLoading(true);

      // If we have tokens, try to get the user profile
      if (tokensToUse?.accessToken) {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${tokensToUse.accessToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setError(null);
        } else if (response.status === 401) {
          await refreshTokens(tokensToUse);
        } else {
          setUser(null);
          setTokens(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setUser(null);
      setTokens(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Try to refresh the token
  const refreshTokens = async (tokensToUse = tokens) => {
    if (!tokensToUse?.refreshToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: tokensToUse.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newTokens = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          tokenType: data.token_type,
        };
        setTokens(newTokens);

        // Now fetch the user data with the new token
        await checkAuth(newTokens);
      } else {
        // If refresh fails, log the user out
        setUser(null);
        setTokens(null);
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      setUser(null);
      setTokens(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Sign in error response:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || "Failed to sign in";
        } catch (e) {
          errorMessage = `Failed to sign in: ${response.status} ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      const newTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
      };

      setTokens(newTokens);

      // After successful login, fetch the user data with the new tokens
      await checkAuth(newTokens);
    } catch (error) {
      setError((error as Error).message);
      console.error("Failed to sign in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    params: RegisterIndividualUser | RegisterOrganizationUser
  ) => {
    try {
      setError(null);
      setIsLoading(true);

      console.log("Signing up with:", {
        email: params.email,
        userType: params.userType,
      });

      const userCreateData = {
        email: params.email,
        password: params.password,
        phone_number: params.phoneNumber,
        user_type:
          params.userType === "individual" ? "individual" : "organization",
        points: 0,
        is_site_admin: false,
      };

      // Add user type specific fields
      if (params.userType === "individual") {
        Object.assign(userCreateData, {
          first_name: (params as RegisterIndividualUser).firstName,
          last_name: (params as RegisterIndividualUser).lastName,
          profession: (params as RegisterIndividualUser).profession || null,
          affiliation: (params as RegisterIndividualUser).affiliation || null,
          organization_name: null,
          organization_address: null,
        });
      } else {
        Object.assign(userCreateData, {
          first_name: null,
          last_name: null,
          profession: null,
          affiliation: null,
          organization_name: (params as RegisterOrganizationUser)
            .organizationName,
          organization_address: (params as RegisterOrganizationUser)
            .organizationAddress,
        });
      }

      console.log("Sending user data:", userCreateData);

      // create the user
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCreateData),
      });

      console.log("Signup response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.detail && Array.isArray(errorData.detail)
              ? errorData.detail
                  .map((err: any) => `${err.loc.join(".")}: ${err.msg}`)
                  .join(", ")
              : errorData.detail || "Failed to sign up";
        } catch (e) {
          errorMessage = `Failed to sign up: ${response.status} ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const userData = await response.json();
      console.log("User created successfully:", userData);
    } catch (error) {
      setError((error as Error).message);
      console.error("Failed to sign up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("auth_tokens");

      //remove tokens locally
      setUser(null);
      setTokens(null);
      setError(null);
    } catch (error) {
      console.error("Failed to sign out:", error);
      setError((error as Error).message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to encapsulate the logic of accessing the AuthContext in a reusable way
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
