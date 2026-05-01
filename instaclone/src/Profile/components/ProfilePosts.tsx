import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { postsApiClient } from "../../Posts/api/client";
import PostCard from "../../Posts/components/PostCard";
import { Post } from "../../Posts/types/Post";

export default function ProfilePosts(props: { userId: number; emptyMessage: string; }) {
    const { userId, emptyMessage } = props;
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const { data, response } = await postsApiClient.GET('/posts/user/{user_id}', {
                params: {
                    path: {
                        user_id: userId.toString(),
                    },
                },
            });

            if (response.ok && data) {
                setPosts(data);
            } else {
                setPosts([]);
            }

            setLoading(false);
        };

        void fetchPosts();
    }, [userId]);

    return <Box sx={{ width: '100%', marginTop: '20px' }}>
        {loading && <CircularProgress />}
        {!loading && posts.length === 0 && (
            <Typography variant="body1" align="center">
                {emptyMessage}
            </Typography>
        )}
        {!loading && posts.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                {posts.map((post) => (
                    <PostCard key={post.postId} post={post} />
                ))}
            </Box>
        )}
    </Box>;
}