import { Avatar, Box, Card, IconButton, TextField, Typography } from "@mui/material";
import { Search as SeachIcon } from "@mui/icons-material";
import { useContext, useState } from "react";
import { userApiBasePath, userApiClient } from "../api/client";
import AppContext from "../../Common/providors/AppContext";
import { useNavigate } from "react-router";

export default function Search() {
    const [usernameSearchInput, setUsernameSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState<{ id: number; username: string; profilePicUrl: string }[]>([]);
    const [noneFound, setNoneFound] = useState(false);

    const navigate = useNavigate();
    const { user } = useContext(AppContext);

    const handleSearch = async () => {
        const { response, data } = await userApiClient.GET('/api/user', {
            params: {
                query: { Username: usernameSearchInput }
            }
        })
        if (response.ok && data) {
            setSearchResults(data);
            setNoneFound(false);
        } else {
            setNoneFound(true);
        }
    }


    return <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        height: 'min-content',
        marginTop: '20px',
    }}>
        <Card sx={{
            padding: '20px',
            width: '70%'
        }}>
            <Box sx={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <TextField
                    label="Search for users by username"
                    variant="outlined"
                    fullWidth
                    value={usernameSearchInput}
                    onChange={(e) => setUsernameSearchInput(e.target.value)}
                />
                <IconButton sx={{ width: '40px', height: '40px' }} onClick={handleSearch}>
                    <SeachIcon />
                </IconButton>
            </Box>
            {noneFound && <Typography variant="subtitle1" color="error">No users found.</Typography>}
            {searchResults.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    {searchResults.filter((result) => result.id !== user?.id).map((result) => (
                        <Card key={result.id} sx={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }} onClick={() => navigate(`/profile/${result.id}`)}>
                            <Avatar src={userApiBasePath + '/' + result.profilePicUrl} />
                            <Typography variant="h6">{result.username}</Typography>
                        </Card>
                    ))}
                </Box>
            )}
        </Card>
    </Box>
}