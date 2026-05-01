import { Avatar, Box, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import User from "../../Common/types/user.interface";
import { userApiClient } from "../api/client";
import { useContext, useState } from "react";
import AppContext from "../../Common/providors/AppContext";
import ProfilePosts from "./ProfilePosts.tsx";

export default function ProfileCard(props: { user: User; setReloadProfile: React.Dispatch<React.SetStateAction<boolean>> }) {
    const context = useContext(AppContext);
    const me = context.user;
    const { user } = props;
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    const unfriend = async () => {
        if (me) {
            const { response } = await userApiClient.DELETE('/api/user/{id}/friends/{friendId}', {
                params: {
                    path: { id: me.id, friendId: user.id },
                }
            });
            if (response.ok) {
                props.setReloadProfile(true);
            }
        }
    };

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
                avatar={<Avatar src={user.profilePictureUrl} sx={{
                    width: 70, height: 70
                }}>{user.username.charAt(0).toUpperCase()}</Avatar>} />
            <CardContent sx={{
                gap: '10px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}>
                <Typography variant="body1">{user.biography || "No biography available."}</Typography>
                <Box sx={{ width: '100%' }}>
                    {user.relationToUser === "Stranger" && (
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
                    {user.relationToUser === "RequestSent" && (
                        <Button variant="contained" color="primary" disabled>
                            Request Sent
                        </Button>
                    )}
                    {user.relationToUser === "Friend" && (
                        <Button variant="contained" color="error" onClick={unfriend}>
                            UnFriend
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
        <ProfilePosts userId={user.id} emptyMessage={`${user.username} has not posted yet.`} />
    </>
}