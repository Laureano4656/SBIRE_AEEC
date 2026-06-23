import { useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../libs/axios";
import ValidationScreen from "./ValidationScreen";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const handleValidated = useCallback(() => {
    navigate("/admin", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const token = params.get("access_token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const initSession = async () => {
      // 1. Exchange the URL token for an httpOnly cookie via the proxy
      await axiosInstance.post("/auth/set-session", {
        access_token: token,
      });

      // 2. Cookie is now set on localhost:5173 — verify it with /auth/me
      await axiosInstance.get("/auth/me");
    };

    initSession().catch(() => {
      navigate("/login", { replace: true });
    });
  }, [params, navigate]);

  return <ValidationScreen onValidated={handleValidated} />;
}
