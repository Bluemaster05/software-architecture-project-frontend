import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Post } from "../types/Post";
import { useEffect, useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment'
import PostDialog from "./PostDialog";
import { useNavigate } from "react-router";
import { postsApiClient } from "../api/client";

export default function PostCard(props: { post: Post; disableDialog?: boolean; mobileWidth?: string; notClickable?: boolean; onPostUpdated?: (post: Post) => void }) {
    const { post, disableDialog, mobileWidth, notClickable, onPostUpdated } = props;
    const { username, userProfilePictureUrl, imgUrl, caption, likes, comments, postId } = post;

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [likedByYou, setLikedByYou] = useState(post.likedByCurrentUser);
    const [likesCount, setLikesCount] = useState(likes);
    const [isLiking, setIsLiking] = useState(false);
    const [postDialogOpen, setPostDialogOpen] = useState(false);

    useEffect(() => {
        setLikesCount(likes);
    }, [likes]);

    useEffect(() => {
        setLikedByYou(post.likedByCurrentUser);
    }, [post.likedByCurrentUser]);

    const handleToggleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        if (!likedByYou) {
            const { response } = await postsApiClient.PUT('/posts/{post_id}/likes', {
                params: { path: { post_id: postId } }
            });
            if (response.ok) {
                const updatedLikes = likesCount + 1;
                setLikesCount(updatedLikes);
                setLikedByYou(true);
                onPostUpdated?.({ ...post, likes: updatedLikes, likedByCurrentUser: true });
            }
        } else {
            const { response } = await postsApiClient.DELETE('/posts/{post_id}/likes', {
                params: { path: { post_id: postId } }
            });
            if (response.ok) {
                const updatedLikes = Math.max(0, likesCount - 1);
                setLikesCount(updatedLikes);
                setLikedByYou(false);
                onPostUpdated?.({ ...post, likes: updatedLikes, likedByCurrentUser: false });
            }
        }
        setIsLiking(false);
    };

    return <Card sx={{
        width: isMobile ? mobileWidth || '80%' : '500px',
        height: 'fit-content',
        
    }}>
        <CardHeader
            avatar={<Avatar src={userProfilePictureUrl}>{username.charAt(0)}</Avatar>}
            title={username}
            onClick={() => navigate(`/profile/${post.userId}`)}
        />
        <CardMedia
            component="img"
            image={imgUrl}
            alt={caption}
            onClick={()=>{
                if (!notClickable) {
                    navigate(`/post/${postId}`)
                }
            }}
        />
        <CardContent>
            <Typography variant="body1">
                {caption}
            </Typography>
        </CardContent>
        <CardActions>
            <IconButton onClick={handleToggleLike} disabled={isLiking}>
                {likedByYou ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2">
                {likesCount}
            </Typography>
            {!disableDialog && <>
                <IconButton onClick={() => setPostDialogOpen(true)}>
                    <CommentIcon />
                </IconButton>
                <Typography variant="body2">
                    {comments.length}
                </Typography>
            </>}
        </CardActions>
        <PostDialog post={post} open={postDialogOpen} onClose={() => setPostDialogOpen(false)} onPostUpdated={onPostUpdated} />
    </Card>
}