// src/lib/hooks/use-user.ts (ENHANCED - Better state propagation)
import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  fullName: string;
  displayName?: string;
  theme?: string;
  verified: boolean;
}

interface UseUserResult {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      console.log("Fetching user data..."); // Debug log
      const response = await fetch("/api/auth/me", {
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("User data fetched successfully:", data.data.user); // Debug log
          setUser(data.data.user);
          setError(null);
        } else {
          setUser(null);
          setError(data.message);
        }
      } else if (response.status === 401) {
        // Unauthorized - user is not logged in
        setUser(null);
        setError(null); // Don't treat this as an error
      } else {
        setUser(null);
        setError("Failed to fetch user data");
      }
    } catch (err) {
      setUser(null);
      setError("An error occurred while fetching user data");
      console.error("User fetch error:", err);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    console.log("Refreshing user data..."); // Debug log
    setIsLoading(true);
    await fetchUser();
    setIsLoading(false);
    console.log("User refresh completed"); // Debug log
  }, [fetchUser]);

  useEffect(() => {
    const loadUser = async () => {
      await fetchUser();
      setIsLoading(false);
    };

    loadUser();
  }, [fetchUser]);

  return { user, isLoading, error, refreshUser };
}
