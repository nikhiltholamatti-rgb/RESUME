import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * ProtectedRoute component
 * - Displays a sleek dark-themed spinner while auth is initializing (loading is true).
 * - Redirects to /login if no user session exists.
 * - Renders children if the user is authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050510] text-slate-300">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-medium tracking-wide text-slate-400">
          Loading your session...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
