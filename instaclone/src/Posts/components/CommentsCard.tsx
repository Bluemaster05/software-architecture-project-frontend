import { Box, Button, Card, CardActions, CardHeader, TextField } from "@mui/material";
import { Comment } from "../types/Comment";
import { useState } from "react";
import { postsApiClient } from "../api/client";
import { Post } from "../types/Post";

export default function CommentsCard(props: { Comments: Comment[]; postId: string; onPostUpdated?: (post: Post) => void }) {
    const { Comments, postId, onPostUpdated } = props;
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


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
                <TextField value={commentText} onChange={(e) => setCommentText(e.target.value)} variant="standard" label="Add a comment..." sx={{ width: '100%' }}  />
                <Button variant="contained" disabled={isSubmitting || !commentText.trim()} onClick={ async ()=> {
                    if (!commentText.trim()) return;
                    setIsSubmitting(true);
                    const { response } = await postsApiClient.POST("/posts/{post_id}/comments", {
                        params: {
                            path: {
                                post_id: postId,
                            }
                        }, body: {
                            text: commentText,
                        }
                    })

                    if (response.ok) {
                        const { data: postData, response: getResp } = await postsApiClient.GET('/posts/{post_id}', {
                            params: {
                                path: { post_id: postId }
                            }
                        });
                        if (getResp.ok && postData) {
                            onPostUpdated?.(postData);
                        }
                        setCommentText('');
                    }

                    setIsSubmitting(false);
                }}>Comment</Button>
            </CardActions>
        </Box>
    </Card>

}