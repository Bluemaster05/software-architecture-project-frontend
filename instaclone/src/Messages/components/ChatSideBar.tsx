import { Box } from "@mui/material";
import { Chat } from "../types/Chat";
import ChatBox from "./ChatBox";

export default function ChatSideBar(props: { chats: Chat[] }) {
    const { chats } = props;

    return <Box sx={{
        minWidth: "180px",
        width: "180px",
        height: "100%",
        borderRight: '1px solid',
        borderColor: 'divider'
    }}>
        {chats.map(chat => <ChatBox key={chat.id} chat={chat} />)}
    </Box>
}