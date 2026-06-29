import { useEffect, useCallback, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../libs/axios";
import ValidationScreen from "./ValidationScreen";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [Auth, setAuth] = useState(false);

  const handleValidated = useCallback(() => {
    console.log("Validated, navigating based on role...");
    console.log(Auth);
    if (Auth) {
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
  }, [navigate, params, Auth]);

  useEffect(() => {
    const token = params.get("access_token");
    console.log("Access token from URL:", token);
    if (!token) {
      return;
    }

    const initSession = async () => {
      // 1. Exchange the URL token for an httpOnly cookie via the proxy
      await axiosInstance.post("/auth/set-session", {
        access_token: token,
      });

      // 2. Cookie is now set on localhost:5173 — verify it with /auth/me
      await axiosInstance.get("/auth/me");

      setAuth(true);
    };

    initSession().catch((err) => {
      console.error("Session init failed:", err);
      // optionally navigate to /error or /login
    });
  }, [params, navigate]);

  return <ValidationScreen onValidated={handleValidated} />;
}
