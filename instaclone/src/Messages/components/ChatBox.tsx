import { Avatar, Box, Typography } from "@mui/material";
import { Chat } from "../types/Chat";
import { useContext, useState } from "react";
import AppContext from "../../Common/providors/AppContext";

export default function ChatBox(props: { chat: Chat, OnClick?: () => void }) {
    const { chat, OnClick } = props;
    const context = useContext(AppContext)
    const { activeMessagesChatId, setActiveMessagesChatId } = context!;
    let isActive: boolean = false;
    if (activeMessagesChatId) {
        isActive = activeMessagesChatId === chat.id.toString();
    }
    const [hovered, setHovered] = useState(false);

    let backgroundColor = 'transparent';
    if (isActive) {
        backgroundColor = 'primary.main';
    } else if (hovered) {
        backgroundColor = 'grey.100';
    }

    return <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        gap: "10px",
        backgroundColor: backgroundColor
    }} onClick={() => {
        setActiveMessagesChatId(chat.id.toString());
        OnClick?.();
    }}
    onMouseOver={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
        <Avatar src={chat.imgSrc} />
        <Typography variant="subtitle1">
            {chat.name}
        </Typography>
    </Box>
}