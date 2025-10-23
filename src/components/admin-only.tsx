"use client";

import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Client-side component that conditionally renders content for admin users only
 * This is for UI purposes only - server-side protection is still required
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null; // Don't render anything while loading
  }

  if (!user) {
    return <>{fallback}</>;
  }

  const role = user.publicMetadata?.role as string;
  
  if (role !== "admin") {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook to check if current user is admin
 */
export function useIsAdmin() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded || !user) {
    return false;
  }
  
  const role = user.publicMetadata?.role as string;
  return role === "admin";
}
