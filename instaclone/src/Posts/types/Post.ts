import { Comment } from "./Comment";

export interface Post {
    postId: number;
    userId: number; // To naviagate to the user's profile when their name is clicked
    username: string; // To display on a Post
    userProfilePictureUrl?: string;
    imgUrl?: string;
    caption: string;
    likes: number;
    comments: Comment[]
}