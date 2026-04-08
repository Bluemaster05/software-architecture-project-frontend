import { Box } from "@mui/material";
import ChatSideBar from "../components/ChatSideBar";
import { sampleChats } from "../sampleData/messagesSampleData";
import { useContext, useState } from "react";
import AppContext from "../../Common/providors/AppContext";
import MessagesBox from "../components/MessagesBox";

export default function Messages() {
    const context = useContext(AppContext);
    const { activeMessagesChatId, setActiveMessagesChatId } = context!;
    const [activeChatId, setActiveChatId] = useState<string | null>(sampleChats[0].id.toString());

    return <Box sx={{
        height: "100%",
        display: 'flex',
    }}>
        <ChatSideBar chats={sampleChats}  />
        <MessagesBox chat={sampleChats.find(chat => chat.id.toString() === activeMessagesChatId) || null} />
    </Box>
}