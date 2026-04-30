export interface Message {
    id: string;
    senderId: number;
    type: "text" | "system";
    content: string;
    createdAt: string;
}
