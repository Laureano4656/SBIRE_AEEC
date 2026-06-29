import { useEffect, useCallback, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../libs/axios";
import ValidationScreen from "./ValidationScreen";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [Auth, setAuth] = useState(false);

  const handleValidated = useCallback(() => {
    if (Auth) {
      if (params.get("role") === "admin") {
        navigate("/admin");
      } else if (params.get("role") === "student") {
        navigate("/student");
      } else if (params.get("role") === "teacher") {
        navigate("/teacher");
      } else if (params.get("role") === "tutor") {
        navigate("/tutor");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const token = params.get("access_token");
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

    initSession().catch(() => {
      setAuth(false);
    });
  }, [params, navigate]);

  return <ValidationScreen onValidated={handleValidated} />;
}
