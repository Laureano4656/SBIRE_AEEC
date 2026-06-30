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
  const [authReady, setAuthReady] = useState(false);

  const handleValidated = useCallback(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const route = ROLE_ROUTES[user.rol];
    navigate(route || "/");
  }, [navigate, user]);

  useEffect(() => {
    const token = params.get("access_token");
    if (!token) return;

    const initSession = async () => {
      await axiosInstance.post("/auth/set-session", {
        access_token: token,
      });
      const res = await axiosInstance.get<Usuario>("/auth/me");
      setUser(res.data);
      setAuthReady(true);
    };

    initSession().catch(() => {
      setAuthReady(false);
    });
  }, [params, navigate]);

  if (!authReady) return null;

  return <ValidationScreen user={user} onValidated={handleValidated} />;
}
