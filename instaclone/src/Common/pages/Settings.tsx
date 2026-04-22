import { Box, Button, Card, Typography } from "@mui/material";
import { userApiClient } from "../../Profile/api/client";

export default function Settings() {
    return <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    }}>
        <Card sx={{
            padding: '20px',
            minHeight: '200px',
            display: 'flex',
            flexDirection: "column",
            gap: '10px',
        }}>
            <Typography>Settings Page</Typography>
            <Button variant="contained" onClick={() => {
                const handleLogout = async () => {
                    const { response } = await userApiClient.POST("/api/auth/logout");
                    if (response.ok) {
                        window.dispatchEvent(new Event("unauthorized"));
                    }
                }
                handleLogout();
            }}>Logout</Button>
        </Card>
    </Box>
}