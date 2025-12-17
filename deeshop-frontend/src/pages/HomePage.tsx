import React from 'react'
import { Link } from 'react-router-dom'

// Import components ของ MUI
import { Container, Typography, Button, Box, Paper } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward' // ไอคอนลูกศร

const HomePage = () => {
    return (
        // Container ช่วยจัดหน้าให้อยู่ตรงกลางและไม่กว้างเกินไป
        <Container maxWidth="md">
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    marginTop: 8 
                }}
            >
                {/* Paper คือกรอบสีขาวที่มีเงา (Shadow) */}
                <Paper 
                    elevation={3} 
                    sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}
                >
                    {/* Typography ใช้จัดการตัวหนังสือแทน h1, p */}
                    <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
                        ยินดีต้อนรับสู่ Deeshop
                    </Typography>
                    
                    <Typography variant="h6" color="text.secondary" paragraph>
                        นี่เป็นหน้าแรกของตัวอย่างโปรเจกต์ Frontend ที่พัฒนาด้วย React + Vite
                    </Typography>
                    
                    <Box sx={{ mt: 4 }}>
                        {/* จุดสำคัญ: การใช้ Button ของ MUI ร่วมกับ Link ของ React Router 
                           ต้องใส่ props component={Link} และ to="..."
                        */}
                        <Button 
                            variant="contained" 
                            size="large"
                            component={Link} 
                            to="/interview"
                            endIcon={<ArrowForwardIcon />} // ใส่ไอคอนท้ายปุ่ม
                        >
                            ไปที่แบบสัมภาษณ์
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default HomePage