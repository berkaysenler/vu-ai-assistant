// src/lib/context/profile-overlay-context.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface ProfileOverlayContextType {
  isProfileOpen: boolean;
  returnUrl: string;
  openProfile: (returnUrl?: string) => void;
  closeProfile: () => void;
}

const ProfileOverlayContext = createContext<
  ProfileOverlayContextType | undefined
>(undefined);

export function ProfileOverlayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [returnUrl, setReturnUrl] = useState("/dashboard");

  const openProfile = (url?: string) => {
    // Store the current URL as return URL
    const currentUrl = url || window.location.pathname + window.location.search;
    setReturnUrl(currentUrl);
    setIsProfileOpen(true);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <ProfileOverlayContext.Provider
      value={{
        isProfileOpen,
        returnUrl,
        openProfile,
        closeProfile,
      }}
    >
      {children}
    </ProfileOverlayContext.Provider>
  );
}

export function useProfileOverlay() {
  const context = useContext(ProfileOverlayContext);
  if (context === undefined) {
    throw new Error(
      "useProfileOverlay must be used within a ProfileOverlayProvider"
    );
  }
  return context;
}
