import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userApiClient } from "../../Profile/api/client";
import { Alert, Snackbar } from "@mui/material";

export default function AuthListener() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = () => {
      navigate("/login");
    };
    window.addEventListener('servererror', () => {
      setOpen(true);
    })
    window.addEventListener("unauthorized", handler);
    return () => window.removeEventListener("unauthorized", handler);
  }, [navigate]);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //       const { data, response, error } = await userApiClient.GET("/api/user/me");
  //       if (response.status !== 200) {
  //           navigate("/login");
  //       }
  //   };
  //   checkAuth();
  // }, []);

  return <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
    <Alert severity="warning" sx={{ width: '100%' }}>
      A server error occurred. Please try again later.
    </Alert>
  </Snackbar>;
}