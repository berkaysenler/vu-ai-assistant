// src/lib/context/user-context.tsx (NEW - Global user state management)
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface User {
  id: string;
  email: string;
  fullName: string;
  displayName?: string;
  theme?: string;
  verified: boolean;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      console.log("Fetching user data..."); // Debug log
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("User data fetched successfully:", data.data.user); // Debug log
          setUser(data.data.user);
          setError(null);
          return data.data.user;
        } else {
          setUser(null);
          setError(data.message);
          return null;
        }
      } else if (response.status === 401) {
        setUser(null);
        setError(null);
        return null;
      } else {
        setUser(null);
        setError("Failed to fetch user data");
        return null;
      }
    } catch (err) {
      setUser(null);
      setError("An error occurred while fetching user data");
      console.error("User fetch error:", err);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    console.log("Refreshing user data..."); // Debug log
    setIsLoading(true);
    const userData = await fetchUser();
    setIsLoading(false);
    console.log("User refresh completed, new data:", userData); // Debug log
  }, [fetchUser]);

  // Function to update user data locally (for immediate UI updates)
  const updateUser = useCallback((userData: Partial<User>) => {
    console.log("Updating user data locally:", userData);
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...userData };
      console.log("Updated user object:", updatedUser);
      return updatedUser;
    });
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      await fetchUser();
      setIsLoading(false);
    };

    loadUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{ user, isLoading, error, refreshUser, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
