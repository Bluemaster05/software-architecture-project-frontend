import { Avatar, Box, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import User from "../../Common/types/user.interface";
import { userApiClient } from "../api/client";
import { useContext, useState } from "react";
import AppContext from "../../Common/providors/AppContext";

export default function ProfileCard(props: { user: User }) {
    const context = useContext(AppContext);
    const me = context.user;
    const { user, isMe } = props;
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    return <>
        <Card sx={{
            width: '80%',
            height: 'fit-content',
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <CardHeader title={<Typography variant="h6">{user.username}</Typography>}
                subheader={<Typography variant="body1">Joined on {new Date(user.joinedOn || '').toLocaleDateString()}</Typography>}
                avatar={<Avatar sx={{
                    width: 70, height: 70
                }}>{user.username.charAt(0).toUpperCase()}</Avatar>} />
            <CardContent sx={{
                gap: '10px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}>
                <Typography variant="body1">{user.biography || isMe ? "You should add a bio!" : "No biography available."}</Typography>
                <Box sx={{ width: '100%' }}>
                    {!isMe && user.relationToUser === "Stranger" && (
                        <Button variant="contained" color="primary" onClick={async () => {
                            if (me) {
                                const { response } = await userApiClient.POST("/api/user/{id}/friends/requests", {
                                    params: {
                                        path: {
                                            id: me.id
                                        }
                                    }, body: {
                                        id: user.id
                                    }
                                })
                                if (response.ok) {
                                    setFriendRequestSent(true);
                                }
                            }
                        }} disabled={friendRequestSent}>
                            {friendRequestSent ? "Request Sent" : "Send Friend Request"}
                        </Button>
                    )}
                    {!isMe && user.relationToUser === "RequestSent" && (
                        <Button variant="contained" color="primary" disabled>
                            Request Sent
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
        {isMe && <Card sx={{
            marginTop: '20px',
            width: '80%',
        }}>
            <CardContent>
                <Typography variant="h6">You have {user.numFriends || 0} Friends. {user.numFriends === 0 || !user.numFriends ? "Send some friend requests!" : ""}</Typography>

            </CardContent>
        </Card>}
    </>
}