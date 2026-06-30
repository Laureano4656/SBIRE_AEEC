import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../contexts/AuthContext";

const ROLE_ROUTES: Record<string, string> = {
  estudiante: "/student",
  administrador: "/superadmin",
  admin_departamental: "/admin",
  docente_carga: "/teacher",
  docente_tutor: "/tutor",
  asesor_par: "/tutor",
};

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || user.carrera_id === null) {
    console.log("User is not authenticated or carrera_id is null, redirecting to /");
    console.log("User object:", user);
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    const redirect = ROLE_ROUTES[user.rol] || "/auth/callback";
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
