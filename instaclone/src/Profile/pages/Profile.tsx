import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { userApiClient } from "../api/client";
import AppContext from "../../Common/providors/AppContext";
import ProfileCard from "../components/ProfileCard";
import { useParams } from "react-router";
import User from "../../Common/types/user.interface";
import YourProfileCard from "../components/YourProfileCard";

export default function Profile() {
    const { id } = useParams();
    const context = useContext(AppContext);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchUser = async () => {
        if (id === 'me') {
            setUser(context?.user || null);
            setLoading(false);
        } else if (id) {
            const { response, data} = await userApiClient.GET('/api/user/{id}/profile', {
                params: {
                    path: { id: parseInt(id)}
                }
            })
            if (response.ok && data) {
                setUser({
                    id: data.id,
                    username: data.username,
                    email: undefined,
                    biography: data.biography,
                    joinedOn: data.joinedOn,
                    numFriends: data.numFriends,
                    relationToUser: data.relationshipToUser
                });
                setLoading(false);
            } else {
                setLoading(false);
            }
        }}
        fetchUser();
    }, [id])


    if (loading) {
        return <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            
        }}>
            <CircularProgress />
        </Box>
    }
    
    if (!user) {
        return <Box>
            <Typography variant="h6">User not found.</Typography>
        </Box>
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            flexDirection: 'column',
        }}>
            {id === 'me' && user && <YourProfileCard />}
            {id !== 'me' && user && <ProfileCard user={user} />}
        </Box>
    );
}