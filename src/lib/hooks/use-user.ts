import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  fullName: string;
  displayName?: string;
}

interface UseUserResult {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include", // Include cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.data.user);
          } else {
            setError(data.message);
          }
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        setError("An error occurred while fetching user data");
        console.error("User fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading, error };
}
