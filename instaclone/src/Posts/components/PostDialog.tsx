import { Box, Dialog, DialogContent, Paper, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Post } from "../types/Post"
import PostCard from "./PostCard";
import CommentsCard from "./CommentsCard";
import CloseIcon from "@mui/icons-material/Close";

export default function PostDialog(props: {
    post: Post;
    open: boolean;
    onClose: () => void;
}) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { post, open, onClose } = props;

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
                <PostCard post={post} disableDialog mobileWidth="default" />
                <CommentsCard Comments={post.comments} />
            </Box>
        </DialogContent>
    </Dialog>
}