import { Box, Button, Card, CardContent, Dialog, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import ChatSideBar from "../components/ChatSideBar";
import { useContext, useEffect, useState } from "react";
import { userApiClient } from "../../Profile/api/client";
import AppContext from "../../Common/providors/AppContext";
import MessagesBox from "../components/MessagesBox";
import { chatsApiClient } from "../api/client";
import { Chat } from "../types/Chat";

export default function Messages() {
    const context = useContext(AppContext);
    const { activeMessagesChatId, user } = context!;
    const [chats, setChats] = useState<Chat[]>([]);
    const [chatMembers, setChatMembers] = useState<{ userId: number, username: string, imgSrc: string }[]>([]);
    const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
    const [newChatName, setNewChatName] = useState("");
    
    const [friendsList, setFriendsList] = useState<{ id: number; username: string }[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<{ id: number; username: string }[]>([]);

    useEffect(() => {
        const fetchChats = async () => {
            const { response, data } = await chatsApiClient.GET('/chats')
            if (response.ok && data) {
                setChats(data);
            }
        }
        fetchChats();
    }, []);

    useEffect(() => {
        const fetchFriends = async () => {
            if (!user) return;
            const { response, data } = await userApiClient.GET('/api/user/{id}/friends', {
                params: { path: { id: user.id } }
            });
            if (response.ok && data) {
                setFriendsList(data);
            }
        };
        fetchFriends();
    }, [user]);

    useEffect(() => {
        if (activeMessagesChatId) {
            const chat = chats.find((c) => c.id === activeMessagesChatId);
            if (chat) {
                setChatMembers(chat.members);
            }
        }
    }, [activeMessagesChatId, chats])


    return <Box sx={{
        height: "100%",
        display: 'flex',
    }}>
        <ChatSideBar chats={chats} openNewChat={setOpenNewChatDialog} />
        <MessagesBox members={chatMembers} chatId={activeMessagesChatId} />
        <Dialog open={openNewChatDialog} onClose={() => setOpenNewChatDialog(false)}>
            <Card>
                <CardContent sx={{
                    width: '300px'
                }}>
                    <TextField
                        label="Chat Name"
                        fullWidth
                        margin="normal"
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                    />
                    <Autocomplete
                        multiple
                        options={friendsList}
                        getOptionLabel={(option) => option.username}
                        value={selectedFriends}
                        onChange={(_event, value) => setSelectedFriends(value)}
                        renderTags={(value: { id: number; username: string }[], getTagProps) =>
                            value.map((option, index) => (
                                <Chip label={option.username} {...getTagProps({ index })} key={option.id} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Add Members"
                                placeholder="Select friends"
                                margin="normal"
                                fullWidth
                            />
                        )}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={async () => {
                        const memberIds = selectedFriends.map((f) => f.id);
                        const { response } = await chatsApiClient.POST("/chats", {
                            body: {
                                name: newChatName,
                                memberIds
                            }
                        })
                        if (response.ok) {
                            const { response, data } = await chatsApiClient.GET('/chats')
                            if (response.ok && data) {
                                setChats(data);
                                setOpenNewChatDialog(false);
                                setSelectedFriends([]);
                                setNewChatName("");
                            }
                        }
                    }}>
                        Create Chat
                    </Button>
                </CardContent>
            </Card>
        </Dialog>
    </Box>
}