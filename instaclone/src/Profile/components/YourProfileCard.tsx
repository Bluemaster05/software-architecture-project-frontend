import { Avatar, Box, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import User from "../../Common/types/user.interface";
import { userApiClient } from "../api/client";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../Common/providors/AppContext";
import { useNavigate } from "react-router";

export default function YourProfileCard() {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const { user } = context;
    const [friends, setFriends] = useState<{ id: number; username: string; }[]>([]);
    const [requestSent, setRequestSent] = useState<{ id: number; username: string; }[]>([]);
    const [requestReceived, setRequestReceived] = useState<{ id: number; username: string; }[]>([]);

    if (!user) {
        navigate('/login')
        return;
    }

    useEffect(() => {
        const fetchFriends = async () => {
            const { response, data } = await userApiClient.GET('/api/user/{id}/friends', {
                params: {
                    path: { id: user.id }
                }
            })
            if (response.ok && data) {
                setFriends(data);
            }
        }
        const fetchFriendRequests = async () => {
            const { response, data } = await userApiClient.GET('/api/user/{id}/friends/requests/sent', {
                params: {
                    path: { id: user.id }
                }
            })
            if (response.ok && data) {
                setRequestSent(data);
            }
        }
        const fetchReceivedFriendRequests = async () => {
            const { response, data } = await userApiClient.GET('/api/user/{id}/friends/requests/received', {
                params: {
                    path: { id: user.id }
                }
            })
            if (response.ok && data) {
                setRequestReceived(data);
            }
        }
        fetchReceivedFriendRequests();
        fetchFriends();
        fetchFriendRequests();
    }, [user.id])

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
                <Typography variant="body1">{user.biography || "You should add a bio!"}</Typography>
            </CardContent>
        </Card>
        <Card sx={{
            marginTop: '20px',
            width: '80%',
        }}>
            <CardContent>
                <Typography variant="h6">You have {user.numFriends || 0} Friends. {user.numFriends === 0 || !user.numFriends ? "Send some friend requests!" : ""}</Typography>
                {friends.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                        {friends.map((friend) => (
                            <Card key={friend.id} sx={{ padding: '5px', cursor: 'pointer' }} onClick={() => navigate(`/profile/${friend.username}`)}>
                                <CardHeader avatar={<Avatar>{friend.username.charAt(0).toUpperCase()}</Avatar>} title={friend.username} />
                            </Card>
                        ))}
                    </Box>
                )}
                <Typography variant="h6">You have {requestSent.length} pending friend requests.</Typography>
                {requestReceived.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                        {requestReceived.map((friend) => (
                            <Card key={friend.id} sx={{ padding: '5px', cursor: 'pointer' }} onClick={() => navigate(`/profile/${friend.username}`)}>
                                <CardHeader avatar={<Avatar>{friend.username.charAt(0).toUpperCase()}</Avatar>} title={friend.username} />
                            </Card>
                        ))}
                    </Box>
                )}
                <Typography variant="h6">You have {requestReceived.length} received friend requests.</Typography>
                {requestReceived.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                        {requestReceived.map((friend) => (
                            <Card key={friend.id} sx={{ padding: '5px', cursor: 'pointer' }} onClick={() => navigate(`/profile/${friend.username}`)}>
                                <CardHeader avatar={<Avatar>{friend.username.charAt(0).toUpperCase()}</Avatar>} title={friend.username} />
                            </Card>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    </>
}