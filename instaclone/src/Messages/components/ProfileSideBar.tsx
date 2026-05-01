import { Avatar, Box, Typography } from "@mui/material";
import { Profile } from "../../Common/types/Profile";
import { useEffect, useState } from "react";
import { userApiBasePath, userApiClient } from "../../Profile/api/client";

export default function ProfileSideBar(props: { userId: number | undefined }) {
    const { userId } = props;
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (userId) {
                const { response, data} = await userApiClient.GET("/api/user/{id}/profile", {
                    params: { path: { id: userId } }
                })
                if (response.ok && data) {
                    setProfile({
                        bio: data.biography,
                        imgSrc: data.profilePicUrl,
                        memberSince: new Date(data.joinedOn).toLocaleDateString(),
                        postsCount: 0,
                        username: data.username,
                        id: data.id
                    });
                }
            }
        }
        fetchProfile();
    }, [userId]);

    const { username, imgSrc, bio, postsCount, memberSince } = profile || {};

    return <Box sx={{
        padding: "20px 40px",
        borderLeft: '1px solid',
        borderColor: 'divider',
        height: '100%',
    }}>
        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center", flexDirection: 'column', gap: '20px' }}>
            <Avatar sx={{ width: '100px', height: '100px' }} src={userApiBasePath + "/" + imgSrc} />
            <Typography variant="h5">
                {username}
            </Typography>
        </Box>
        <Box sx={{ 
            marginTop: '30px'
        }}>
            <Typography variant="subtitle1" color="text.secondary" >
                Bio:
            </Typography>
            <Typography variant="body1" sx={{ marginTop: '10px' }}>
                {bio}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ marginTop: '10px' }} >
                Posts:
            </Typography>
            <Typography variant="body1" sx={{ marginTop: '10px' }}>
                {postsCount}
            </Typography><Typography variant="subtitle1" color="text.secondary" sx={{ marginTop: '10px' }}>
                Member since:
            </Typography>
            <Typography variant="body1" sx={{ marginTop: '10px' }}>
                {memberSince}
            </Typography>
        </Box>

    </Box>
}