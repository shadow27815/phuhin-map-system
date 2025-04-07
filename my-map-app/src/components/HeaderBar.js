import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";

function HeadersBar() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAdminLogin = () => {
        handleMenuClose();
        navigate('/admin/login');
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#8B4513", boxShadow: "none", borderBottom: "1px solid #E0E0E0" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                    {/* LOGO */}
                    <IconButton onClick={handleLogoClick} sx={{ p: 0 }}>
                        <Avatar
                            alt="NU Logo"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjNnG4S3XghAe7ZrcUPaCTOeLJZfhtamKj1Q&s"
                            sx={{ width: 60, height: 50 }}
                        />
                    </IconButton>
                    {/* /LOGO */}

                    {/* Map Menu */}
                    <Box>
                        <IconButton onClick={handleMenuOpen}>
                            <img
                                src="/assets/mapicon3.png"
                                alt="อุทยานแห่งชาติ"
                                style={{ width: 60, height: "auto" }}
                            />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <MenuItem onClick={handleAdminLogin}>สำหรับเจ้าหน้าที่</MenuItem>
                        </Menu>
                    </Box>
                    {/* /Map Menu */}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default HeadersBar;
