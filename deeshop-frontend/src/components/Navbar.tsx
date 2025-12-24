import React, { useState } from 'react';
import { 
    AppBar, Toolbar, Container, Typography, Button, Box, IconButton, 
    Avatar, Menu, MenuItem, Stack 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import { useAuth } from '../context/AuthContext';
import AuthDialog from './AuthDialog';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    
    // State สำหรับเปิด Dialog
    const [authOpen, setAuthOpen] = useState(false);
    
    // State สำหรับ Menu Dropdown
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate('/'); // Logout แล้วกลับหน้าแรก
    };

    // Callback: Login ผ่าน Navbar สำเร็จ -> แค่ปิด Popup อยู่หน้าเดิม
    const handleLoginSuccess = () => {
        setAuthOpen(false);
    };

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #E5E7EB' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                            <Box sx={{ p: 0.8, bgcolor: '#111827', borderRadius: '8px', color: 'white' }}>
                                <ShoppingBagRoundedIcon sx={{ fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', fontFamily: '"Kanit", sans-serif' }}>
                                Deeshop
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                        </Stack>

                        <Box>
                            {isAuthenticated && user ? (
                                <>
                                    <Button 
                                        onClick={handleMenuOpen}
                                        startIcon={<Avatar src={user.avatar} sx={{ width: 28, height: 28 }} />}
                                        endIcon={<PersonRoundedIcon sx={{ color: '#9CA3AF' }} />}
                                        sx={{ textTransform: 'none', color: '#111827', fontWeight: 600, bgcolor: '#F3F4F6', borderRadius: '50px', pl: 0.5, pr: 1.5, py: 0.5 }}
                                    >
                                        {user.name}
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        PaperProps={{ elevation: 3, sx: { borderRadius: '16px', mt: 1, minWidth: 150 } }}
                                    >
                                        <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
                                            <ExitToAppRoundedIcon fontSize="small" sx={{ mr: 1 }} /> ออกจากระบบ
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    onClick={() => setAuthOpen(true)}
                                    sx={{ bgcolor: '#111827', color: 'white', borderRadius: '50px', fontWeight: 600, px: 3 }}
                                >
                                    เข้าสู่ระบบ
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <AuthDialog 
                open={authOpen} 
                onClose={() => setAuthOpen(false)} 
                onSuccess={handleLoginSuccess} 
            />
        </>
    );
};

export default Navbar;