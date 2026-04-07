import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router";

export default function NavButtonDesktop(props: {
    expanded: boolean;
    Icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}) {
    const { expanded, Icon, label, onClick } = props;
    const [hovered, setHovered] = useState(false);
    
    const location = useLocation();
    const selected  = location.pathname.startsWith(`/${label.toLowerCase()}`);

    let backgroundColor = "transparent";
    if (selected) {
        backgroundColor = "primary.main";
    } else if (hovered) {
        backgroundColor = "rgba(255, 255, 255, 0.08)";
    }

    return (<>
        <IconButton sx={{
            position: "relative",
            borderRadius: "10px",
            width: 43,
            minWidth: 43,
            flexShrink: 0,
            backgroundColor: 'transparent',
            "&:hover": {
                backgroundColor: 'transparent',
            },
            overflow: "visible"
        }} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: expanded ? "140px" : "43px",
                    borderRadius: "10px",
                    backgroundColor: backgroundColor,
                    transition: "width 0.2s ease",
                    zIndex: 0,
                }}
            />
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', zIndex: 1  }}>
                {Icon}
            </Box>
            <Typography sx={{
                position: "absolute",
                left: "50px",

                opacity: expanded ? 1 : 0,
                transform: expanded ? "translateX(0)" : "translateX(-20px)",
                transition: "0.1s ease-in-out",

                fontWeight: "600",
                fontSize: "16px",
            }}>{label}</Typography>
        </IconButton>
    </>)
}