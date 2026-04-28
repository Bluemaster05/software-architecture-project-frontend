import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { userApiClient } from "../../Profile/api/client";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
// import { useAuth } from "../auth/useAuth";

function ProtectedRoute(props: { ignoreAuth?: boolean }) {
    const { ignoreAuth } = props;
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
            if (!ignoreAuth) {
                const { data, response, error} = await userApiClient.GET("/api/user/me");
                if (response.status !== 200) {
                    return <Navigate to="/login" replace />;
                } else {
                    setLoading(false);
                    setUser({id: "temp"});
                }
            }} catch {
                setLoading(false);
            }
        };
        checkAuth();
    }, [ignoreAuth]);

    if (!ignoreAuth) {
        
        if (loading) {
            return (
                <Box sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                }}>
                    <CircularProgress />
                    {/* <Typography variant="body1">Checking your session...</Typography> */}
                </Box>
            );
        }

        if (!user) {
            return <Navigate to="/login" replace />;
        }
    }

    return <Outlet />;
}

export default ProtectedRoute;