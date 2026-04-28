import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Post } from "../types/Post";
import { postsApiClient } from "../api/client";
import PostCard from "../components/PostCard";

export default function PostPage() {
    let { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    useEffect(() => {
        const fetchPost = async (id: string) => {
            const { data, response } = await postsApiClient.GET(`/posts/{post_id}`, {
                params: { path: { post_id: id } },
            });
            if (response.ok && data) {
                setPost(data);
            } else {
                setPost(null);
                //Navigate to not found page
            } 
        }
        if (id){
            fetchPost(id);
        }
    }, [id]);

    return <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    }}>
        {!post && <CircularProgress />}
        {post && <PostCard post={post} notClickable/>}
    </Box>
}