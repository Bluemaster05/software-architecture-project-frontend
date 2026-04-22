import { Alert, Button, Card, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useNavigate } from "react-router";
import { userApiClient } from "../../Profile/api/client";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loginAlert, setLoginAlert] = useState("");

    return <>
        <Box sx={{
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
                {loginAlert && <Alert severity="warning">{loginAlert}</Alert>}
                <Typography>Already have an account? Login:</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: "column",
                    gap: '10px'
                }}>
                    <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="contained"
                        onClick={ ()=> {
                            const handleLogin = async () => {
                                const { response } = await userApiClient.POST("/api/auth/login", {
                                    body: {
                                        username,
                                        password,
                                    }
                                });
                                if (response.ok) {
                                    navigate("/feed");
                                } else {
                                    if (response.status === 401) {
                                        setLoginAlert("Invalid username or password");
                                    }
                                }
                            }

                            handleLogin();
                        }}

                    >Login</Button>
                </Box>
                <Typography>Don't have an account? Register:</Typography>
                <Button variant="outlined"
                    onClick={ ()=> {
                        navigate("/register");
                    }}
                >Register</Button>
            </Card>
        </Box>
    </>
}