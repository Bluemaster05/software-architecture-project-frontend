import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import PostCard from "../components/PostCard";
import { useContext, useEffect, useState } from "react";
import { Post } from "../types/Post";
import { postsApiClient } from "../api/client";
import AppContext from "../../Common/providors/AppContext";

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [caption, setCaption] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createError, setCreateError] = useState("");

    const { user } = useContext(AppContext);

    const fetchPosts = async () => {
        const { data, response } = await postsApiClient.GET("/posts/feed");
        if (response.status === 200 && data) {
            setPosts(data);
        }
    };

    const handlePostUpdated = (updatedPost: Post) => {
        setPosts((prevPosts) => prevPosts.map((post) => post.postId === updatedPost.postId ? updatedPost : post));
    };

    useEffect(() => {
        void fetchPosts();
    }, []);

    const resetCreateForm = () => {
        setCaption("");
        setImageFile(null);
        setCreateError("");
    };

    const handleCreatePost = async () => {
        if (!caption.trim() || !imageFile) {
            setCreateError("Please fill caption and choose an image.");
            return;
        }

        setIsSubmitting(true);
        setCreateError("");
        if (!user) {
            setCreateError("User information is missing. Please try again.");
            setIsSubmitting(false);
            return;
        }
        const formData = new FormData();
        formData.append("caption", caption.trim());
        formData.append("image", imageFile); // must be File/Blob

        const { data, response, error } = await postsApiClient.POST("/posts", {
            body: formData as never, // cast only because generated OpenAPI type is too strict
        });

        if (response.status === 201 && data) {
            setPosts((prevPosts) => [data, ...prevPosts]);
            setIsCreateDialogOpen(false);
            resetCreateForm();
        } else {
            const validationError = error as { detail?: Array<{ msg?: string }> } | undefined;
            setCreateError(
                validationError?.detail?.[0]?.msg ??
                    "Could not create post. Please check your input and try again."
            );
        }

        setIsSubmitting(false);
    };

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
            <Button variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
                Create Post
            </Button>
            {posts.map((post) => <PostCard key={post.postId} post={post} onPostUpdated={handlePostUpdated} />)}
            <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create Post</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "6px",
                    }}>
                        {createError && <Alert severity="error">{createError}</Alert>}
                        <TextField
                            label="Caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            multiline
                            minRows={3}
                            fullWidth
                        />

                        <Button variant="outlined" component="label">
                            {imageFile ? `Selected: ${imageFile.name}` : "Choose image (jpg/png)"}
                            <input
                                hidden
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={(event) => {
                                    const selectedFile = event.target.files?.[0] ?? null;
                                    setImageFile(selectedFile);
                                }}
                            />
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: "0 24px 24px" }}>
                    <Button
                        onClick={() => {
                            setIsCreateDialogOpen(false);
                            resetCreateForm();
                        }}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleCreatePost} variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}