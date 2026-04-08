import { Message } from "./Message";

export interface Chat {
    id: number;
    name: string;
    imgSrc: string;
    messages: Message[];
}