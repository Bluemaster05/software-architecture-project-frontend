import { Box, Button, Card, CardActions, CardHeader, TextField } from "@mui/material";
import { Comment } from "../types/Comment";

export default function CommentsCard(props: { Comments: Comment[] }) {
    const { Comments } = props;

    return <Card sx={{
        // width: '420px',
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
    }}>
        <CardHeader 
            title="Comments"
        />
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            minHeight: 0,
        }}>
            <Box sx={{
                overflowY: 'auto',
                px: 1,
            }}>
                {Comments.map((comment) => <Card key={comment.commentId} sx={{ padding: '10px' }}>
                    <CardHeader
                        avatar={comment.userProfilePictureUrl ? <img src={comment.userProfilePictureUrl} alt={`${comment.username}'s profile picture`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} /> : comment.username.charAt(0)}
                        title={comment.username}
                        subheader={comment.text}
                        sx={{
                            maxWidth: '400px'
                        }}
                    />
                </Card>)}
            </Box>
            <CardActions sx={{
                display: 'flex',justifyContent: 'center'
            }}>
                <TextField variant="standard" label="Add a comment..." sx={{ width: '100%' }} />
                <Button variant="contained">Comment</Button>
            </CardActions>
        </Box>
    </Card>

}