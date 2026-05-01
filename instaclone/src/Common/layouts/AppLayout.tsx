import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FeedIcon from '@mui/icons-material/Feed';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Outlet, useNavigate } from "react-router";
import { useState } from "react";
import NavButtonDesktop from "../components/NavButtonDesktop";
import { useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function AppLayout() {
    const [expanded, setExpanded] = useState(false);
    const [expandedToggle, setExpandedToggle] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const showExpanded = isMobile ? false : expanded;

    return <Box sx={{
        display: "flex",
        height: "100%",
        flexDirection: isMobile ? "column" : "row-reverse",
    }}>

        {<Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <Outlet />
        </Box>}
        <Box
            onMouseOver={() => {
                if (!isMobile && !expandedToggle) {
                    setExpanded(true);
                }
            }}
            onMouseLeave={() => {
                if (!isMobile && !expandedToggle) {
                    setExpanded(false);
                }
            }}
            sx={{
                borderRight: "1px solid",
                borderTop: isMobile ? "1px solid" : "none",
                borderColor: "divider",
                display: "flex",
                gap: "5px",
                flexDirection: isMobile ? "row" : "column",
                justifyContent: isMobile ? "space-around" : "flex-start",
                paddingY: "5px",
                paddingX: "10px",
                transition: "width 0.2s ease-in-out",
                width: isMobile ? "100%" : expanded ? "160px" : "65px",
                overflow: "hidden",
            }}>
            <IconButton sx={{ width: '40px', display: isMobile ? "none" : "inline-flex" }} onClick={() => {
                if (expandedToggle) {
                    setExpanded(false);
                    setExpandedToggle(false);
                } else {
                    setExpanded(true);
                    setExpandedToggle(true);
                }
            }}>
                <ArrowBackIosNewIcon sx={{
                    rotate: expandedToggle ? "" : "180deg"
                }}></ArrowBackIosNewIcon>
            </IconButton>
            <NavButtonDesktop
                expanded={showExpanded}
                Icon={<FeedIcon />}
                label="Feed"
                onClick={() => navigate('/feed')}
            />
            <NavButtonDesktop
                expanded={showExpanded}
                Icon={<ForumIcon />}
                label="Messages"
                onClick={() => navigate('/messages')}
            />
            <NavButtonDesktop
                expanded={showExpanded}
                Icon={<AccountBoxIcon />}
                label="Profile"
                onClick={() => navigate('/profile/me')}
            />
            <NavButtonDesktop
                expanded={showExpanded}
                Icon={<SearchIcon />}
                label="Search"
                onClick={() => navigate('/search')} />
            <NavButtonDesktop
                expanded={showExpanded}
                Icon={<SettingsIcon />}
                label="Settings"
                onClick={() => navigate('/settings')} />
        </Box>
    </Box>
}