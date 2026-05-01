import { Box, Dialog, DialogContent, useMediaQuery, useTheme } from "@mui/material"
import { Post } from "../types/Post"
import PostCard from "./PostCard";
import CommentsCard from "./CommentsCard";
import { useEffect, useState } from "react";

export default function PostDialog(props: {
    post: Post;
    open: boolean;
    onClose: () => void;
    onPostUpdated?: (post: Post) => void;
}) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { post, open, onClose, onPostUpdated } = props;
    const [postState, setPostState] = useState(post);

    useEffect(() => {
        setPostState(post);
    }, [post]);

    return <Dialog open={open} onClose={onClose}
        sx={{
            '& .MuiDialog-paper': {
                backgroundColor: 'transparent',
                backgroundImage: 'none',
                boxShadow: 'none',
            },
            '& .MuiPaper-root': {
                maxWidth: '1200px',
            },
            padding: 0,
        }}
        slotProps={{
            paper: {
                sx: {backgroundColor: "transparent"
                }
            },
        }}
        
    >
        <DialogContent sx={{
            backgroundColor: "transparent",
            p: 0,
            
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: isMobile ? 'column-reverse' : 'row',
                gap: '20px',
            }}>
                <PostCard post={postState} disableDialog mobileWidth="default" />
                <CommentsCard
                    Comments={postState.comments}
                    postId={postState.postId}
                    onPostUpdated={(updatedPost) => {
                        setPostState(updatedPost);
                        onPostUpdated?.(updatedPost);
                    }}
                />
            </Box>
        </DialogContent>
    </Dialog>
}