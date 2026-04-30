import { Box, Button, Card, CardContent, Dialog, TextField } from "@mui/material";
import ChatSideBar from "../components/ChatSideBar";
import { sampleChats } from "../sampleData/messagesSampleData";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../Common/providors/AppContext";
import MessagesBox from "../components/MessagesBox";
import { chatsApiClient } from "../api/client";
import { Chat } from "../types/Chat";

export default function Messages() {
    const context = useContext(AppContext);
    const { activeMessagesChatId, setActiveMessagesChatId } = context!;
    const [chats, setChats] = useState<Chat[]>([]);
    const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
    const [newChatName, setNewChatName] = useState("");
    const [newChatMembers, setNewChatMembers] = useState("");
    useEffect(() => {
        const fetchChats = async () => {
            const { response, data } = await chatsApiClient.GET('/chats')
            if (response.ok && data) {
                setChats(data);
            }
        }
        fetchChats();
    }, []);

    return <Box sx={{
        height: "100%",
        display: 'flex',
    }}>
        <ChatSideBar chats={chats} openNewChat={setOpenNewChatDialog} />
        <MessagesBox chat={} />
        <Dialog open={openNewChatDialog} onClose={() => setOpenNewChatDialog(false)}>
            <Card>
                <CardContent>
                    <TextField
                        label="Chat Name"
                        fullWidth
                        margin="normal"
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                    />
                    <TextField
                        label="Add Members (comma separated usernames)"
                        fullWidth
                        margin="normal"
                        value={newChatMembers}
                        onChange={(e) => setNewChatMembers(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={async () => {
                        const { response } = await chatsApiClient.POST("/chats", {
                            body: {
                                name: newChatName,
                                memberIds: newChatMembers.split(',').map((id) => Number(id.trim()))
                            }
                        })
                        if (response.ok) {
                            const { response, data } = await chatsApiClient.GET('/chats')
                            if (response.ok && data) {
                                setChats(data);
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