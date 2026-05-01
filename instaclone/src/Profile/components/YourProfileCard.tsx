import { Avatar, Box, Button, Card, CardContent, CardHeader, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material";
import { userApiBasePath, userApiClient } from "../api/client";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../Common/providors/AppContext";
import { useNavigate } from "react-router";
import { Check, Search } from "@mui/icons-material";
import { Block } from "@mui/icons-material";

export default function YourProfileCard() {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const { user, setUser } = context;
    const [friends, setFriends] = useState<{ id: number; username: string; profilePicUrl: string; }[]>([]);
    const [requestSent, setRequestSent] = useState<{ id: number; username: string; profilePicUrl: string; }[]>([]);
    const [requestReceived, setRequestReceived] = useState<{ id: number; username: string; profilePicUrl: string; }[]>([]);
    const [value, setValue] = useState(0);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [biography, setBiography] = useState(user?.biography || "");
    const [username, setUsername] = useState(user?.username || "");
    const [imageFile, setImageFile] = useState<File | null>(null);

    if (!user) {
        navigate('/login')
        return;
    }

    const acceptFriendRequest = async (friendId: number) => {
        const { response } = await userApiClient.POST('/api/user/{id}/friends', {
            params: {
                path: { id: user.id },
            }, body: {
                id: friendId
            }
        })
        if (response.ok) {
            fetchReceivedFriendRequests();
            fetchFriends();
            fetchFriendRequests();
        }
    }

    const ignoreFriendRequest = async (friendId: number) => {
        const { response } = await userApiClient.DELETE('/api/user/{id}/friends/requests/{friendId}', {
            params: {
                path: { id: user.id, friendId },
            }
        })
        if (response.ok) {
            fetchReceivedFriendRequests();
            fetchFriends();
            fetchFriendRequests();
        }
    }

    const fetchFriends = async () => {
        const { response, data } = await userApiClient.GET('/api/user/{id}/friends', {
            params: {
                path: { id: user.id }
            }
        })
        if (response.ok && data) {
            setFriends(data);
        }
    }
    const fetchFriendRequests = async () => {
        const { response, data } = await userApiClient.GET('/api/user/{id}/friends/requests/sent', {
            params: {
                path: { id: user.id }
            }
        })
        if (response.ok && data) {
            setRequestSent(data);
        }
    }
    const fetchReceivedFriendRequests = async () => {
        const { response, data } = await userApiClient.GET('/api/user/{id}/friends/requests/received', {
            params: {
                path: { id: user.id }
            }
        })
        if (response.ok && data) {
            setRequestReceived(data);
        }
    }

    const updateProfile = async () => {
        let profileUpdated = false;
        const { response } = await userApiClient.PATCH('/api/user/{id}', {
            params: {
                path: { id: user.id }
            },
            body: {
                username,
                biography
            }
        })
        if (response.ok) {
            profileUpdated = true;
        }
        if (imageFile) {
            const formData = new FormData();
            formData.append("ProfilePic", imageFile);
            const { response } = await userApiClient.POST('/api/user/{id}/picture', {
                params: {
                    path: { id: user.id }
                },
                body: formData as never,
            })
            if (response.ok && profileUpdated) {
                const { response, data } = await userApiClient.GET('/api/user/me')
                if (response.ok && data) {
                    setUser({
                        id: data.id,
                        username: data.username,
                        email: data.email,
                        biography: data.biography,
                        joinedOn: data.joinedOn,
                        numFriends: undefined,
                        relationToUser: undefined,
                        profilePictureUrl: userApiBasePath + '/' + data.profilePicUrl
                    });
                }
            }
        }
        setEditProfileOpen(false);

    }

    useEffect(() => {
        fetchReceivedFriendRequests();
        fetchFriends();
        fetchFriendRequests();
    }, [user.id])

    return <>
        <Card sx={{
            width: '80%',
            height: 'fit-content',
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {!editProfileOpen && <><CardHeader title={<Typography variant="h6">{user.username}</Typography>}
                subheader={<Typography variant="body1">Joined on {new Date(user.joinedOn || '').toLocaleDateString()}</Typography>}
                avatar={<Avatar src={user.profilePictureUrl} sx={{
                    width: 70, height: 70
                }}>{user.username.charAt(0).toUpperCase()}</Avatar>} />
                <CardContent sx={{
                    gap: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}>
                    <Typography variant="body1">{user.biography || "You should add a bio!"}</Typography>
                    <Button sx={{ width: "150px" }} variant="contained" color="primary" onClick={() => setEditProfileOpen(true)}>
                        Edit Profile
                    </Button>
                </CardContent></>}
            {editProfileOpen && <>
                <Box sx={{
                    margin: '20px',
                    width: '100%'
                }}>
                    <Box sx={{ width: '350px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <TextField label="Username" variant="outlined" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
                        <TextField label="Biography" variant="outlined" value={biography} fullWidth onChange={(e) => setBiography(e.target.value)} />
                        <Typography variant="body1">Profile Picture</Typography>
                        <Button variant="outlined" component="label">
                            {imageFile ? `Selected: ${imageFile.name}` : "Choose image (jpg/png)"}
                            <input
                                hidden
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={(event) => {
                                    const selectedFile = event.target.files?.[0] ?? null;
                                    setImageFile(selectedFile);
                                }}
                            />
                        </Button>
                        {imageFile && <Avatar src={URL.createObjectURL(imageFile)} sx={{ width: '100px', height: '100px' }} />}
                        <Button sx={{ width: "150px" }} variant="contained" color="primary" onClick={() => updateProfile()}>
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </>}
        </Card>
        <Card sx={{
            marginTop: '20px',
            width: '80%',
        }}>
            <CardContent>
                <Tabs
                    value={value}
                    onChange={(_event, newValue) => setValue(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{ overflowX: 'auto' }}
                >
                    <Tab label={"Posts"} {...a11yProps(0)} />
                    <Tab label={"Friends " + friends.length} {...a11yProps(1)} />
                    <Tab label={"Sent Requests " + requestSent.length} {...a11yProps(2)} />
                    <Tab label={"Received Requests " + requestReceived.length} {...a11yProps(3)} />
                </Tabs>
                <CustomTabPanel value={value} index={0}>
                    <Typography variant="h6">Your posts will appear here.</Typography>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    {friends.length > 0 && (
                        <Box sx={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {friends.map((friend) => (
                                <Card key={friend.id} sx={{ padding: '5px', cursor: 'pointer', width: '200px' }} onClick={() => navigate(`/profile/${friend.id}`)}>
                                    <CardHeader avatar={<Avatar src={userApiBasePath + '/' + friend.profilePicUrl}>{friend.username.charAt(0).toUpperCase()}</Avatar>} title={friend.username} />
                                </Card>
                            ))}
                        </Box>
                    )}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    {requestSent.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                            {requestSent.map((friend) => (
                                <Card key={friend.id} sx={{ padding: '5px', cursor: 'pointer', width: '200px' }} onClick={() => navigate(`/profile/${friend.id}`)}>
                                    <CardHeader avatar={<Avatar src={userApiBasePath + '/' + friend.profilePicUrl}>{friend.username.charAt(0).toUpperCase()}</Avatar>} title={friend.username} />
                                </Card>
                            ))}
                        </Box>
                    )}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    {requestReceived.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                            {requestReceived.map((friend) => (
                                <Card key={friend.id} sx={{ padding: '5px', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <CardHeader avatar={<Avatar src={userApiBasePath + '/' + friend.profilePicUrl}>{friend.username.charAt(0).toUpperCase()}</Avatar>} title={friend.username} />
                                    <IconButton onClick={() => {
                                        acceptFriendRequest(friend.id)
                                    }}>
                                        <Check color="success"></Check>
                                    </IconButton>
                                    <IconButton onClick={() => {
                                        ignoreFriendRequest(friend.id)
                                    }}>
                                        <Block color="error"></Block>
                                    </IconButton>
                                    <IconButton onClick={() => navigate(`/profile/${friend.id}`)}>
                                        <Search></Search>
                                    </IconButton>
                                </Card>
                            ))}
                        </Box>
                    )}
                </CustomTabPanel>
            </CardContent>
        </Card>
    </>
}



interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
