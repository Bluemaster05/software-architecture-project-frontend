import { Avatar, Box, Typography } from "@mui/material";
import { Chat } from "../types/Chat";
import ProfileSideBar from "./ProfileSideBar";

export default function MessagesBox(props: { chat: Chat | null }) {
    const { chat } = props;

    return <Box sx={{
        display: 'flex',
        width: '100%'
    }}>
        <Box sx={{
            overflowY: 'scroll',
            width: '100%',
        }}>
            {chat && chat.messages.map(message => <Box key={message.id} sx={{
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
        <Box sx={{
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
        </Box>
    </Box> 
}