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
import { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { postsApiClient } from "../api/client";

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [caption, setCaption] = useState("");
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [userProfilePictureUrl, setUserProfilePictureUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createError, setCreateError] = useState("");

    const fetchPosts = async () => {
        const { data, response } = await postsApiClient.GET("/posts");
        if (response.status === 200 && data) {
            setPosts(data);
        }
    };

    useEffect(() => {
        void fetchPosts();
    }, []);

    const resetCreateForm = () => {
        setCaption("");
        setUserId("");
        setUsername("");
        setUserProfilePictureUrl("");
        setImageFile(null);
        setCreateError("");
    };

    const handleCreatePost = async () => {
        if (!caption.trim() || !userId.trim() || !username.trim() || !imageFile) {
            setCreateError("Please fill userId, username, caption, and choose an image.");
            return;
        }

        setIsSubmitting(true);
        setCreateError("");

        const formData = new FormData();
        formData.append("userId", userId.trim());
        formData.append("username", username.trim());
        formData.append("userProfilePictureUrl", userProfilePictureUrl.trim());
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
            {posts.map((post) => <PostCard key={post.postId} post={post} />)}
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
                            label="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Profile Picture URL"
                            value={userProfilePictureUrl}
                            onChange={(e) => setUserProfilePictureUrl(e.target.value)}
                            fullWidth
                        />
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