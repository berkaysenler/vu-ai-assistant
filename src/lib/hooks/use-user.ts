import { useState, useEffect } from "react";

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

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
          setError(null);
        } else {
          setError(data.message);
        }
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      setError("An error occurred while fetching user data");
      console.error("User fetch error:", err);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    await fetchUser();
    setIsLoading(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      await fetchUser();
      setIsLoading(false);
    };

    loadUser();
  }, []);

  return { user, isLoading, error, refreshUser };
}
