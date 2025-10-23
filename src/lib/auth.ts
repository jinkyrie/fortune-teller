import { auth } from "@clerk/nextjs/server";

/**
 * Server-side helper to require admin role
 * Throws error if user is not authenticated or not admin
 */
export async function requireAdmin() {
  console.log('🔐 Auth: Starting admin check');
  
  const { userId, sessionClaims } = await auth();
  console.log('🔐 Auth: User ID:', userId);
  console.log('🔐 Auth: Session claims:', sessionClaims);
  
  if (!userId) {
    console.log('❌ Auth: No user ID found');
    throw new Error("Unauthorized");
  }

  // Get email from session claims
  const userEmail = sessionClaims?.email || 
                   sessionClaims?.email_addresses?.[0]?.email_address ||
                   sessionClaims?.primary_email_address?.email_address;
  
  console.log('🔐 Auth: User email:', userEmail);
  
  // Check if email is admin email
  const adminEmail = process.env.ADMIN_EMAIL || "kyriakosginis@gmail.com";
  console.log('🔐 Auth: Admin email:', adminEmail);
  
  if (userEmail !== adminEmail) {
    console.log('❌ Auth: Email mismatch - user is not admin');
    throw new Error("Forbidden");
  }

  console.log('✅ Auth: Admin access granted');
  return { userId, role: "admin" };
}

/**
 * Server-side helper to require authentication
 * Throws error if user is not authenticated
 */
export async function requireAuth() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const role = sessionClaims?.public_metadata?.role as string;
  
  return { userId, role };
}

/**
 * Get current user info
 */
export async function getCurrentUser() {
  const { userId, sessionClaims } = await auth();
  
  return {
    userId,
    role: sessionClaims?.metadata?.role as string,
    email: sessionClaims?.email as string,
  };
}

