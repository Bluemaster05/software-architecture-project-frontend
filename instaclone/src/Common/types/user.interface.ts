export default interface User {
    id: number;
    username: string;
    email: string | undefined;
    biography: string;
    joinedOn: string | undefined
    numFriends: number | undefined;
    relationToUser: "Stranger" | "Friend" | "RequestSent" | "RequestReceived" | undefined;
}