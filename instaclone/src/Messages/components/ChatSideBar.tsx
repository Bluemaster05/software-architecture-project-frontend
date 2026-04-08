import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Chat } from "../types/Chat";
import ChatBox from "./ChatBox";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import BackArrowIcon from '@mui/icons-material/ArrowBackIos';


export default function ChatSideBar(props: { chats: Chat[] }) {
    const { chats } = props;
    const theme = useTheme();
    const ismobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [open, setOpen] = useState(false);

    if (ismobile) {
        return <>
            <Box sx={{
                position: 'absolute',
                zIndex: '1',
                backgroundColor: 'primary.main',
                opacity: 0.95,
                top: 10,
                left: 10,
                borderRadius: '10px'
            }}>
                <IconButton>
                    <MenuIcon onClick={() => setOpen(true)} />
                </IconButton>
            </Box>

            <Box sx={{
                position: 'absolute',
                zIndex: '1',
                backgroundColor: 'background.paper',
                width: '100%',
                height: 'calc(100% - 50px)',
                display: 'flex',
                flexDirection: 'column',
                transform: open ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.2s ease-in-out',
                // justifyContent: 'space-between',
            }}>
                <Box sx={{
                    display: 'flex',
                    // justifyContent: 'flex-start',
                    padding: 1,
                }}>
                    <IconButton onClick={() => setOpen(false)}>
                        <BackArrowIcon />
                    </IconButton>
                </Box>
                <Box sx={{
                    overflowY: 'scroll',
                }}>
                    {chats.map(chat => <ChatBox key={chat.id} chat={chat} OnClick={()=>{ setOpen(false)}} />)}
                </Box>
            </Box>
        </>;
    }


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