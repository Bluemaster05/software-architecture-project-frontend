import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FeedIcon from '@mui/icons-material/Feed';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Outlet } from "react-router";
import { useState } from "react";

const IconButtonStyle = {
    width: '40px'
}

export default function AppLayout() {
    const [expanded, setExpanded] = useState(false);

    return <Box sx={{
        display: "flex",
        height: "100%",
    }}>
            <Box sx={{
                borderRight: "2px solid black",
                display: "flex",
                flexDirection: "column",
                // alignItems: expanded ? "flex-start" : "center",
                paddingY: "5px",
                paddingX: "10px",
                transition: "width 0.3s ease-in-out",
                width: expanded ? "200px" : "50px",
            }}>
                <IconButton sx={IconButtonStyle} onClick={() => setExpanded(!expanded)}>
                     <ArrowBackIosNewIcon sx={{
                        rotate: expanded ? "" : "180deg"
                     }}></ArrowBackIosNewIcon>
                </IconButton>
                <IconButton sx={IconButtonStyle}>
                   <FeedIcon></FeedIcon>
                </IconButton>
                <IconButton sx={IconButtonStyle}>
                   <FeedIcon></FeedIcon>
                </IconButton>
                <IconButton sx={IconButtonStyle}>
                   <FeedIcon></FeedIcon>
                </IconButton>
            </Box>
            <Outlet />
    </Box>
    
}