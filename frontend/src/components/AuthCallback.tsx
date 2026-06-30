import { useEffect, useCallback, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../libs/axios";
import type { Usuario } from "../contexts/AuthContext";
import ValidationScreen from "./ValidationScreen";

const ROLE_ROUTES: Record<string, string> = {
  estudiante: "/student",
  administrador: "/superadmin",
  admin_departamental: "/admin",
  docente_carga: "/teacher",
  docente_tutor: "/tutor",
  asesor_par: "/tutor",
};

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<Usuario | null>(null);
  const [auth, setAuth] = useState(false);

  const handleValidated = useCallback(() => {
    if (auth) {
      console.log("Navigating based on role:", params.get("role"));
      if (params.get("role") === "administrador") {
        navigate("/admin");
      } else if (params.get("role") === "estudiante") {
        navigate("/student");
      } else if (params.get("role") === "docente_carga") {
        navigate("/teacher");
      } else if (params.get("role") === "docente_tutor") {
        navigate("/tutor");
      } else {
        navigate("/");
      }
    }
  }, [navigate, params, auth]);

  useEffect(() => {
    const token = params.get("access_token");
    console.log("Access token from URL:", token);
    if (!token) {
      return;
    }

    const initSession = async () => {
      await axiosInstance.post("/auth/set-session", {
        access_token: token,
      });
      const res = await axiosInstance.get<Usuario>("/auth/me");
      setUser(res.data);
      setAuth(true);
    };

    initSession().catch((err) => {
      console.error("Session init failed:", err);
      // optionally navigate to /error or /login
    });
  }, [params, navigate]);

  if (!auth) return null;

  return <ValidationScreen user={user} onValidated={handleValidated} />;
}
