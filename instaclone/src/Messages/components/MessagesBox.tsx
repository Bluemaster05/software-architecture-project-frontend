import { Avatar, Box, CircularProgress, IconButton, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import ProfileSideBar from "./ProfileSideBar";
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Message } from "../types/Message";
import AppContext from "../../Common/providors/AppContext";
import { chatsApiClient } from "../api/client";
import { userApiBasePath } from "../../Profile/api/client";

// export default function MessagesBox(props: { members: { userId: number, username: string, imgSrc: string }[], chatId: string | null }) {
//     const { members, chatId } = props;
//     const {user} = useContext(AppContext);
//     const chatRef = useRef<HTMLDivElement>(null);
//     const suppressTopLoaderRef = useRef(false);
//     const topLoaderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//     const [messages, setMessages] = useState<Message[]>([]);
//     const [atTopMessages, setAtTopMessages] = useState(false);

//     const [messageInput, setMessageInput] = useState("");

//     const theme = useTheme();
//     const isLargerThanMd = useMediaQuery(theme.breakpoints.up('md'));
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//     useEffect(() => {
//         setMessages(messagesHere || []);
//         setAtTopMessages(false);
//     }, [messagesHere]);

//     const handleScroll = () => {
//         const chatBox = chatRef.current;
//         if (chatBox && !suppressTopLoaderRef.current) {
//             const isScrollable = chatBox.scrollHeight > chatBox.clientHeight;
//             if (!isScrollable) {
//                 return;
//             }

//             if (chatBox.scrollTop === 0) {
//                 setAtTopMessages(true);
//                 if (topLoaderTimeoutRef.current) {
//                     clearTimeout(topLoaderTimeoutRef.current);
//                 }
//                 topLoaderTimeoutRef.current = setTimeout(() => {
//                     setAtTopMessages(false);
//                     topLoaderTimeoutRef.current = null;
//                 }, 2000);
//             }
//         }
//     }

//     useEffect(() => {
//         const chatBox = chatRef.current;
//         if (chatBox) {
//             suppressTopLoaderRef.current = true;
//             chatBox.scrollTop = chatBox.scrollHeight;
//             setTimeout(() => {
//                 suppressTopLoaderRef.current = false;
//             }, 100);
//         }
//     }, [messagesHere?.length]);

//     useEffect(() => {
//         return () => {
//             if (topLoaderTimeoutRef.current) {
//                 clearTimeout(topLoaderTimeoutRef.current);
//             }
//         };
//     }, []);



//     return <Box sx={{
//         display: 'flex',
//         width: '100%'
//     }}>
//         <Box sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//             width: '100%',
//             height: '100%',
//         }}>
//             <Box onScroll={handleScroll} ref={chatRef} sx={{
//                 overflowY: 'scroll',
//                 // display: 'flex',
//                 // flexDirection: 'column',
//                 // justifyContent: 'flex-end',
//                 flex: 1,
//                 height: '100%',
//                 minHeight: 0,
//                 width: '100%',
//             }}>
//                 <Box sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'flex-end',
//                     minHeight: '100%'
//                 }}>
//                     {atTopMessages && <Box sx={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         padding: '20px'
//                     }}>
//                         <CircularProgress></CircularProgress>
//                     </Box>}
//                     {messages && messages.map(message => <Box key={message.id} sx={{
//                         display: 'flex',
//                         padding: '10px',
//                         gap: '10px'
//                     }}>
//                         <Avatar src={members.find((m) => m.userId === message.senderId)?.imgSrc} />
//                         <Box>
//                             <Typography variant="subtitle2">
//                                 {members.find((m) => m.userId === message.senderId)?.username || 'Unknown User'} - {new Date(members.find((m) => m.userId === message.senderId)?.userId || 0).toLocaleTimeString()}
//                             </Typography>
//                             <Typography variant="body1">
//                                 {message.content}
//                             </Typography>
//                         </Box>
//                     </Box>)}
//                 </Box>
//             </Box>
//             <Box sx={{ display: "flex", padding: '10px', alignItems: "center", justifyContent: 'center', gap: '10px' }}>
//                 <TextField
//                     fullWidth
//                     placeholder="Type a message..."
//                     variant="outlined"
//                     value={messageInput}
//                     onChange={(e) => setMessageInput(e.target.value)}
//                 />
//                 <IconButton onClick={async () => {
//                     if (chatId){
//                         const {response, data} = await chatsApiClient.POST('/chats/{chatId}/messages', {
//                             params: { path: { chatId: chatId } },
//                             body: { content: messageInput }
//                         });
//                         if (response.ok && data) {
//                             setMessages(prev => [...prev, data]);
//                             setMessageInput("");
//                         }
//                     }
//                 }}>
//                     <SendIcon />
//                 </IconButton>
//             </Box>
//         </Box>
//         {members && members.length === 2 && isLargerThanMd && <Box sx={{
//             width: '300px',
//             minWidth: '300px',
//         }}>
//             <ProfileSideBar userId={members.find((m)=>{m.userId !== user?.id})?.userId}/>
//         </Box>}
//     </Box>
// }

type Member = {
    userId: number;
    username: string;
    imgSrc: string;
};

export default function MessagesBox({
    members,
    chatId
}: {
    members: Member[];
    chatId: string | null;
}) {
    const { user } = useContext(AppContext);
    const chatRef = useRef<HTMLDivElement>(null);
    const initialScrollDoneRef = useRef(false);

    const theme = useTheme();
    const isLargerThanMd = useMediaQuery(theme.breakpoints.up("md"));

    // ---------------- STATE ----------------
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState("");

    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const [loadingInitial, setLoadingInitial] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sending, setSending] = useState(false);

    // ---------------- HELPERS ----------------
    const scrollToBottom = () => {
        const el = chatRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    };

    const getMember = (id: number) =>
        members.find((m) => m.userId === id);

    const isNearBottom = () => {
        const el = chatRef.current;
        if (!el) return true;

        return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    };

    // ---------------- FETCH INITIAL ----------------
    const loadMessages = useCallback(async () => {
        if (!chatId) return;

        setLoadingInitial(true);

        const { data, response } = await chatsApiClient.GET(
            "/chats/{chatId}/messages",
            {
                params: {
                    path: { chatId },
                    query: { limit: 20 }
                }
            }
        );

        if (response.ok && data) {
            const ordered = [...data.messages].reverse(); // oldest → newest
            setMessages(ordered);
            setCursor(data.nextCursor || null);
            setHasMore(data.hasMore);
        }

        setLoadingInitial(false);
    }, [chatId]);

    // ---------------- FETCH OLDER ----------------
    const loadOlderMessages = useCallback(async () => {
        if (!chatId || !cursor || !hasMore || loadingMore) return;

        const chatBox = chatRef.current;
        const prevHeight = chatBox?.scrollHeight || 0;

        setLoadingMore(true);

        const { data, response } = await chatsApiClient.GET(
            "/chats/{chatId}/messages",
            {
                params: {
                    path: { chatId },
                    query: {
                        before: cursor,
                        limit: 20
                    }
                }
            }
        );

        if (response.ok && data) {
            const older = [...data.messages].reverse();

            setMessages((prev) => [...older, ...prev]);
            setCursor(data.nextCursor || null);
            setHasMore(data.hasMore);

            // maintain scroll position
            setTimeout(() => {
                if (chatBox) {
                    chatBox.scrollTop = chatBox.scrollHeight - prevHeight;
                }
            }, 0);
        }

        setLoadingMore(false);
    }, [chatId, cursor, hasMore, loadingMore]);

    // ---------------- SEND ----------------
    const sendMessage = async () => {
        if (!chatId || !messageInput.trim() || sending) return;

        setSending(true);

        const { data, response } = await chatsApiClient.POST(
            "/chats/{chatId}/messages",
            {
                params: { path: { chatId } },
                body: { content: messageInput }
            }
        );

        if (response.ok && data) {
            setMessages((prev) => [...prev, data]);
            setMessageInput("");
            setTimeout(scrollToBottom, 0);
        }

        setSending(false);
    };

    // ---------------- SCROLL ----------------
    const handleScroll = () => {
        const el = chatRef.current;
        if (!el) return;

        if (el.scrollTop === 0) {
            loadOlderMessages();
        }
    };

    // ---------------- GET NEW MESSAGES ----------------

    const pollNewMessages = useCallback(async () => {
        if (!chatId || loadingInitial) return;

        const shouldStickToBottom = isNearBottom();

        const { data, response } = await chatsApiClient.GET(
            "/chats/{chatId}/messages",
            {
                params: {
                    path: { chatId },
                    query: { limit: 20 }
                }
            }
        );

        if (response.ok && data) {
            const incoming = [...data.messages].reverse(); // oldest → newest

            setMessages((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));

                const newMessages = incoming.filter(
                    (m) => !existingIds.has(m.id)
                );

                if (newMessages.length === 0) return prev;

                return [...prev, ...newMessages];
            });

            // auto-scroll ONLY if user was already at bottom
            if (shouldStickToBottom) {
                setTimeout(scrollToBottom, 0);
            }
        }
    }, [chatId, loadingInitial]);

    // ---------------- EFFECTS ----------------
    useEffect(() => {
        setMessages([]);
        setCursor(null);
        setHasMore(true);
        initialScrollDoneRef.current = false;

        if (chatId) {
            loadMessages();
        }
    }, [chatId, loadMessages]);

    useLayoutEffect(() => {
        if (!chatId || loadingInitial || initialScrollDoneRef.current) return;

        scrollToBottom();
        initialScrollDoneRef.current = true;
    }, [chatId, loadingInitial, messages.length]);

    useEffect(() => {
        if (!chatId) return;

        const interval = setInterval(() => {
            pollNewMessages();
        }, 500); // every 1/2s

        return () => clearInterval(interval);
    }, [chatId, pollNewMessages]);

    // ---------------- RENDER ----------------
    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%"
                }}
            >
                {/* MESSAGE LIST */}
                <Box
                    ref={chatRef}
                    onScroll={handleScroll}
                    sx={{
                        overflowY: "auto",
                        flex: 1,
                        minHeight: 0
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            minHeight: "100%"
                        }}
                    >
                        {/* TOP LOADER */}
                        {loadingMore && (
                            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}

                        {/* INITIAL LOADER */}
                        {loadingInitial ? (
                            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            messages.map((message) => {
                                const member = getMember(message.senderId);

                                return (
                                    <Box
                                        key={message.id}
                                        sx={{ display: "flex", p: 1.5, gap: 1.5 }}
                                    >
                                        <Avatar src={userApiBasePath + "/" + member?.imgSrc} />
                                        <Box>
                                            <Typography variant="subtitle2">
                                                {member?.username || "Unknown"} •{" "}
                                                {new Date(message.createdAt).toLocaleTimeString()}
                                            </Typography>
                                            <Typography variant="body1">
                                                {message.content}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })
                        )}
                    </Box>
                </Box>

                {/* INPUT */}
                <Box
                    sx={{
                        display: "flex",
                        p: 1,
                        gap: 1,
                        alignItems: "center"
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <IconButton onClick={sendMessage} disabled={sending}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* SIDEBAR */}
            {members.length === 2 && isLargerThanMd && (
                <Box sx={{ width: 300 }}>
                    <ProfileSideBar
                        userId={
                            members.find((m) => m.userId !== user?.id)?.userId
                        }
                    />
                </Box>
            )}
        </Box>
    );
}