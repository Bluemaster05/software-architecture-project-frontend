import { Alert, Box, Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { userApiClient } from "../../Profile/api/client";

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerAlert, setRegisterAlert] = useState("");

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
                {registerAlert && <Alert severity="warning">{registerAlert}</Alert>}
                <Typography>Please Register:</Typography>
                <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" onClick={()=>{
                    const handleRegister = async () => {
                        const { response } = await userApiClient.POST("/api/user", {
                            body: {
                                username,
                                email,
                                password,
                            }
                        });
                        if (response.ok) {
                            const { response } = await userApiClient.POST("/api/auth/login", {
                                body: {
                                    username,
                                    password,
                                }
                            });
                            if (response.ok) {
                                navigate("/feed");
                            } else {
                                setRegisterAlert("Registration succeeded but login failed. Please try logging in.");
                            }
                        } else {
                            setRegisterAlert("Registration failed. Please try again.");
                        }
                    }
                    handleRegister()
                }}>Register</Button>
                <Typography>Already have an account? Login:</Typography>
                <Button variant="outlined" onClick={()=>{
                    navigate("/login");
                }}>Login</Button>
            </Card>
    </Box>
}