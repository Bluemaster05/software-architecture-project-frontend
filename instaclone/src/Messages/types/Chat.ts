import { Message } from "./Message";

export interface Chat {
    id: string;
    name?: string | undefined;
    lastMessage?: Message | undefined;
    unreadCount: number;
    members: {
        userId: number;
        username: string;
        imgSrc: string;
    }[];
}
