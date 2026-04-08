import { Avatar, Box, CircularProgress, IconButton, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Chat } from "../types/Chat";
import SendIcon from '@mui/icons-material/Send';
import ProfileSideBar from "./ProfileSideBar";
import { useEffect, useRef, useState } from "react";

export default function MessagesBox(props: { chat: Chat | null }) {
    const { chat } = props;
    const chatRef = useRef<HTMLDivElement>(null);
    const suppressTopLoaderRef = useRef(false);
    const topLoaderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [messages, setMessages] = useState(chat ? chat.messages : []);
    const [atTopMessages, setAtTopMessages] = useState(false);
    
    const theme = useTheme();
    const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        setMessages(chat ? chat.messages : []);
        setAtTopMessages(false);
    }, [chat?.id, chat]);

    const handleScroll = () => {
        const chatBox = chatRef.current;
        if (chatBox && !suppressTopLoaderRef.current) {
            const isScrollable = chatBox.scrollHeight > chatBox.clientHeight;
            if (!isScrollable) {
                return;
            }

            if (chatBox.scrollTop === 0) {
                setAtTopMessages(true);
                if (topLoaderTimeoutRef.current) {
                    clearTimeout(topLoaderTimeoutRef.current);
                }
                topLoaderTimeoutRef.current = setTimeout(() => {
                    setAtTopMessages(false);
                    topLoaderTimeoutRef.current = null;
                }, 2000);
            }
        }
    }

    useEffect(() => {
        const chatBox = chatRef.current;
        if (chatBox) {
            suppressTopLoaderRef.current = true;
            chatBox.scrollTop = chatBox.scrollHeight;
            setTimeout(() => {
                suppressTopLoaderRef.current = false;
            }, 100);
        }
    }, [chat?.id, messages.length]);

    useEffect(() => {
        return () => {
            if (topLoaderTimeoutRef.current) {
                clearTimeout(topLoaderTimeoutRef.current);
            }
        };
    }, []);



    return <Box sx={{
        display: 'flex',
        width: '100%'
    }}>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
        }}>
            <Box onScroll={handleScroll} ref={chatRef} sx={{
                overflowY: 'scroll',
                // display: 'flex',
                // flexDirection: 'column',
                // justifyContent: 'flex-end',
                flex: 1,
                height: '100%',
                minHeight: 0,
                width: '100%',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    minHeight: '100%'
                }}>
                    {atTopMessages && <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <CircularProgress></CircularProgress>
                    </Box>}
                    {messages && messages.map(message => <Box key={message.id} sx={{
                        display: 'flex',
                        padding: '10px',
                        gap: '10px'
                    }}>
                        <Avatar src={message.sender.imgSrc} />
                        <Box>
                            <Typography variant="subtitle2">
                                {message.sender.username} - {message.timestamp}
                            </Typography>
                            <Typography variant="body1">
                                {message.content}
                            </Typography>
                        </Box>
                    </Box>)}
                </Box>
            </Box>
            <Box sx={{ display: "flex", padding: '10px', alignItems: "center", justifyContent: 'center', gap: '10px' }}>
                <TextField fullWidth placeholder="Type a message..." variant="outlined" />
                <IconButton>
                    <SendIcon></SendIcon>
                </IconButton>
            </Box>
        </Box>
        {isLargerThanMd && <Box sx={{
            width: '300px',
            minWidth: '300px',
        }}>
            <ProfileSideBar profile={{
                id: chat?.id || 0,
                username: chat?.name || '',
                imgSrc: chat?.imgSrc || '',
                bio: 'Hey there! I am using Instaclone. This is a sample bio for the profile sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                postsCount: 42,
                memberSince: 'January 2020'
            }} />
        </Box>}
    </Box>
}