import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
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
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "#8B4513",
                boxShadow: "none",
                borderBottom: "1px solid #E0E0E0",
                paddingY: { xs: 1, md: 0 },
                zIndex: 1300,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        flexWrap: "wrap"
                    }}
                >
                    {/* LOGO ซ้าย */}
                    <IconButton onClick={handleLogoClick} sx={{ p: 0 }}>
                        <Avatar
                            alt="NU Logo"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjNnG4S3XghAe7ZrcUPaCTOeLJZfhtamKj1Q&s"
                            sx={{ width: { xs: 45, md: 60 }, height: { xs: 40, md: 50 } }}
                        />
                    </IconButton>

                    {/* ข้อความตรงกลาง */}
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: "12px", sm: "14px", md: "18px" },
                            textAlign: "center",
                            flex: 1,
                            mx: 2,
                            whiteSpace: "normal",
                            lineHeight: 1.4
                        }}
                    >
                        ระบบแนะนำเส้นทางแหล่งท่องเที่ยวภายในอุทยานแห่งชาติภูหินร่องกล้า
                    </Typography>

                    {/* LOGO ขวา */}
                    <Box>
                        <IconButton onClick={handleMenuOpen}>
                            <img
                                src="/assets/mapicon3.png"
                                alt="อุทยานแห่งชาติ"
                                style={{ width: "auto", height: "50px", maxHeight: "100%" }}
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
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default HeadersBar;
