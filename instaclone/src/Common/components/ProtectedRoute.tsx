import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { userApiClient } from "../../Profile/api/client";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import AppContext from "../providors/AppContext";
// import { useAuth } from "../auth/useAuth";

function ProtectedRoute(props: { ignoreAuth?: boolean }) {
    const context = useContext(AppContext);
    const { user, setUser } = context!;
    const { ignoreAuth } = props;
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!ignoreAuth) {
                    const { data, response, error } = await userApiClient.GET("/api/user/me");
                    if (response.status !== 200) {
                        return <Navigate to="/login" replace />;
                    } else if (response.ok && data) {
                        setUser({
                            id: data.id,
                            username: data.username,
                            email: data.email,
                            biography: data.biography,
                            joinedOn: data.joinedOn,
                            numFriends: undefined,
                            relationToUser: undefined
                        });
                        setLoading(false);
                    }
                }
            } catch {
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