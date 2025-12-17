import React, { useState } from 'react';
import {
    Dialog, DialogContent, Typography, Box, Button, Stack, TextField, Divider, IconButton, CircularProgress
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useAuth } from '../context/AuthContext';

interface AuthDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void; // Callback สำคัญ: จะทำอะไรต่อเมื่อ Login ผ่าน
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose, onSuccess }) => {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

    const handleLogin = async (provider: string) => {
        setLoading(true);
        await login(provider); // รอ Login เสร็จ
        setLoading(false);
        onSuccess(); // แจ้ง Parent Component ว่าเสร็จแล้ว
        // หมายเหตุ: ไม่สั่ง onClose() ที่นี่ เพื่อให้ Parent ตัดสินใจ flow ต่อเอง
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="xs" 
            fullWidth 
            PaperProps={{ style: { borderRadius: 24, padding: 16 } }}
        >
            <Box display="flex" justifyContent="flex-end">
                <IconButton onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
            </Box>
            
            <DialogContent sx={{ textAlign: 'center', pb: 4, pt: 0 }}>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                    {mode === 'LOGIN' ? 'ยินดีต้อนรับกลับ!' : 'สร้างบัญชีใหม่'}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={4}>
                    {mode === 'LOGIN' ? 'กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ' : 'สมัครสมาชิกเพื่อรับสิทธิพิเศษ'}
                </Typography>

                <Stack spacing={2} mb={3}>
                    <Button 
                        variant="outlined" fullWidth startIcon={<GoogleIcon />} 
                        onClick={() => handleLogin('google')}
                        disabled={loading}
                        sx={{ borderRadius: '50px', py: 1.5, borderColor: '#E5E7EB', color: '#1F2937' }}
                    >
                        ดำเนินการต่อด้วย Google
                    </Button>
                    <Button 
                        variant="contained" fullWidth startIcon={<FacebookIcon />} 
                        onClick={() => handleLogin('facebook')}
                        disabled={loading}
                        sx={{ borderRadius: '50px', py: 1.5, bgcolor: '#1877F2' }}
                    >
                        ดำเนินการต่อด้วย Facebook
                    </Button>
                </Stack>

                <Divider sx={{ my: 3, color: 'text.secondary', fontSize: '0.875rem' }}>หรือ</Divider>

                <Stack spacing={2}>
                    <TextField label="อีเมล" fullWidth size="small" variant="outlined" disabled={loading} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    <TextField label="รหัสผ่าน" type="password" fullWidth size="small" variant="outlined" disabled={loading} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    <Button 
                        variant="contained" fullWidth size="large"
                        disabled={loading}
                        onClick={() => handleLogin('email')}
                        sx={{ borderRadius: '50px', py: 1.5, bgcolor: '#111827', mt: 1 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : (mode === 'LOGIN' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
                    </Button>
                </Stack>

                <Box mt={3}>
                    <Typography variant="body2" color="text.secondary">
                        {mode === 'LOGIN' ? 'ยังไม่มีบัญชีใช่ไหม?' : 'มีบัญชีอยู่แล้ว?'}
                        <Box 
                            component="span" 
                            sx={{ color: '#111827', fontWeight: 700, cursor: 'pointer', ml: 1 }}
                            onClick={() => setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                        >
                            {mode === 'LOGIN' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                        </Box>
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AuthDialog;