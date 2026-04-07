import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Post } from "../types/Post";
import { useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment'
import PostDialog from "./PostDialog";

export default function PostCard(props: { post: Post; disableDialog?: boolean, mobileWidth?: string }) {
    const { post, disableDialog, mobileWidth } = props;
    const { username, userProfilePictureUrl, imgUrl, caption, likes, comments } = post;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [likedByYou, setLikedByYou] = useState(false);
    const [postDialogOpen, setPostDialogOpen] = useState(false);

    return <Card sx={{
        width: isMobile ? mobileWidth || '80%' : '500px',
        height: 'fit-content',
    }}>
        <CardHeader
            avatar={<Avatar src={userProfilePictureUrl}>{username.charAt(0)}</Avatar>}
            title={username}
        />
        <CardMedia
            component="img"
            image={imgUrl}
            alt={caption}
        />
        <CardContent>
            <Typography variant="body1">
                {caption}
            </Typography>
        </CardContent>
        <CardActions>
            <IconButton onClick={() => setLikedByYou(!likedByYou)}>
                {likedByYou ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2">
                {likes}
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
        <PostDialog post={post} open={postDialogOpen} onClose={() => setPostDialogOpen(false)} />
    </Card>
}