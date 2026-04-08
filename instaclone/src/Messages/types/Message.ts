export interface Message {
    id: number;
    sender: {
        username: string;
        imgSrc: string;
    }
    content: string;
    timestamp: string;
}