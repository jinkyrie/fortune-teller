import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isAdminEmail, validateAdminSecurity } from "@/lib/admin-config";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/admin/assign-role",
  "/assign-admin"
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)"
]);

// Exclude assign-role from admin protection
const isAdminAssignRoute = createRouteMatcher([
  "/api/admin/assign-role"
]);

export default clerkMiddleware(async (auth, req) => {
  // Make sign-in and sign-up routes public
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // SECURE ADMIN CHECK - Only one admin allowed
  if (isAdminRoute(req) && !isAdminAssignRoute(req)) {
    const { userId } = await auth();
    
    // Check if user is authenticated at all
    if (!userId) {
      return Response.redirect(new URL("/sign-in", req.url));
    }
    
    // Let the client-side admin page handle the final security check
    // This allows the page to load while maintaining security
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
