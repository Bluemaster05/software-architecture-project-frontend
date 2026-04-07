export interface Comment {
    commentId: number;
    userId: number; // To naviagate to the user's profile when their name is clicked
    username: string; // To display on a Comment
    userProfilePictureUrl?: string;
    text: string;
    likes: number;
    timestamp: string; // Used to show how long ago the comment was made - Also so you can sort comments before handing them to UI
}