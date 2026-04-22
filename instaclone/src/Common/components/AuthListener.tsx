import { useEffect } from "react";
import { useNavigate } from "react-router";
import { userApiClient } from "../../Profile/api/client";

export default function AuthListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      navigate("/login");
    };

    window.addEventListener("unauthorized", handler);
    return () => window.removeEventListener("unauthorized", handler);
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
        const { data, response, error } = await userApiClient.GET("/api/user/me");
        if (response.status !== 200) {
            navigate("/login");
        }
    };
    checkAuth();
  }, []);

  return null;
}