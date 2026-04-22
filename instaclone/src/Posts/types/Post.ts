import { Comment } from "./Comment";

export interface Post {
    postId: string;
    userId: string;
    username: string;
    userProfilePictureUrl: string;
    imgUrl: string;
    caption: string;
    timestamp: string;
    likes: number;
    comments: Comment[];
}