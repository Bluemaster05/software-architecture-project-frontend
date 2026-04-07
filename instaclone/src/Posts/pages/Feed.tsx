import { Box, Typography } from "@mui/material";
import postsSampleData from "../SampleData/PostsSampleData";
import PostCard from "../components/PostCard";

export default function Feed() {
    return (

        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '20px',
        }}
        >
            <Typography variant="h4" sx={{ marginTop: '20px' }}>
                Your Feed
            </Typography>
            {postsSampleData.map((post) => <PostCard key={post.postId} post={post} />)}
        </Box>
    );
}