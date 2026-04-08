import { Avatar, Box, Typography } from "@mui/material";
import { Profile } from "../../Common/types/Profile";

export default function ProfileSideBar(props: { profile: Profile }) {
    const { profile } = props;
    const { username, imgSrc, bio, postsCount, memberSince } = profile;

    return <Box sx={{
        padding: "20px 40px",
        borderLeft: '1px solid',
        borderColor: 'divider',
        height: '100%',
    }}>
        <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center", flexDirection: 'column', gap: '20px' }}>
            <Avatar sx={{ width: '100px', height: '100px' }} src={imgSrc} />
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