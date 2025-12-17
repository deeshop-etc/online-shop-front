import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Container, Box, Card, Typography, Stepper, Step, StepLabel, Button, 
    CircularProgress, Stack
} from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded' // ไอคอนกากบาท
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'

const STEPS = ['รอตรวจสอบยอดเงิน', 'กำลังทำรายการ', 'ทำรายการสำเร็จ']

const StatusPage = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = useState(0)
    const [status, setStatus] = useState('PENDING')

    // --- Mock Real-time: เช็คสถานะทุก 2 วินาที ---
    useEffect(() => {
        const checkStatus = () => {
            const savedOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
            const currentOrder = savedOrders.find((o: any) => o.id === orderId)

            if (currentOrder) {
                setStatus(currentOrder.status)
                if (currentOrder.status === 'PENDING') setActiveStep(0)
                else if (currentOrder.status === 'PROCESSING') setActiveStep(1)
                else if (currentOrder.status === 'COMPLETED') setActiveStep(3)
                else if (currentOrder.status === 'REJECTED') setActiveStep(-1) // สถานะพิเศษ
            }
        }

        checkStatus()
        const interval = setInterval(checkStatus, 2000)
        return () => clearInterval(interval)
    }, [orderId])

    const getIcon = () => {
        if (status === 'COMPLETED') return <CheckCircleRoundedIcon sx={{ fontSize: 80, color: '#10B981' }} />
        if (status === 'PROCESSING') return <LocalShippingRoundedIcon sx={{ fontSize: 80, color: '#3B82F6' }} />
        if (status === 'REJECTED') return <CancelRoundedIcon sx={{ fontSize: 80, color: '#EF4444' }} /> // สีแดง
        return <HourglassTopRoundedIcon sx={{ fontSize: 80, color: '#F59E0B' }} />
    }

    const getTitle = () => {
        if (status === 'COMPLETED') return 'ทำรายการสำเร็จ!'
        if (status === 'PROCESSING') return 'กำลังเติมเกมให้คุณ...'
        if (status === 'REJECTED') return 'รายการถูกปฏิเสธ'
        return 'กำลังตรวจสอบยอดเงิน...'
    }

    return (
        <Box sx={{ background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f3f4f6 100%)', minHeight: '100vh', py: 8, fontFamily: '"Kanit", sans-serif' }}>
            <Container maxWidth="sm">
                <Card elevation={0} sx={{ borderRadius: '24px', border: '1px solid #E5E7EB', textAlign: 'center', p: 4 }}>
                    
                    {/* Animated Icon */}
                    <Box sx={{ mb: 3, animation: (status === 'PENDING' || status === 'PROCESSING') ? 'pulse 2s infinite' : 'none' }}>
                        {getIcon()}
                    </Box>

                    <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: status === 'REJECTED' ? '#EF4444' : '#111827' }}>
                        {getTitle()}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
                        Order ID: #{orderId}
                    </Typography>

                    {/* Stepper (ซ่อนเมื่อถูก Reject) */}
                    {status !== 'REJECTED' && (
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                            {STEPS.map((label) => (
                                <Step key={label}><StepLabel>{label}</StepLabel></Step>
                            ))}
                        </Stepper>
                    )}

                    {/* Content ตามสถานะ */}
                    {status === 'COMPLETED' && (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 3, color: '#059669', bgcolor: '#ECFDF5', p: 2, borderRadius: 2 }}>
                                สินค้าถูกเติมเข้าบัญชีของคุณเรียบร้อยแล้ว
                            </Typography>
                            <Button variant="contained" size="large" startIcon={<HomeRoundedIcon />} onClick={() => navigate('/')} sx={{ borderRadius: '50px', bgcolor: '#111827' }}>
                                กลับหน้าหลัก
                            </Button>
                        </Box>
                    )}

                    {status === 'REJECTED' && (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 3, color: '#B91C1C', bgcolor: '#FEE2E2', p: 2, borderRadius: 2 }}>
                                ขออภัย รายการนี้ไม่ผ่านการอนุมัติ <br/>
                                (อาจเกิดจากยอดเงินไม่ถูกต้อง หรือสลิปซ้ำ)
                            </Typography>
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button variant="outlined" size="large" startIcon={<SupportAgentRoundedIcon />} sx={{ borderRadius: '50px' }}>
                                    ติดต่อแอดมิน
                                </Button>
                                <Button variant="contained" size="large" onClick={() => navigate('/')} sx={{ borderRadius: '50px', bgcolor: '#111827' }}>
                                    ทำรายการใหม่
                                </Button>
                            </Stack>
                        </Box>
                    )}

                    {(status === 'PENDING' || status === 'PROCESSING') && (
                        <Box sx={{ bgcolor: '#F9FAFB', p: 3, borderRadius: 4 }}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                                <CircularProgress size={20} thickness={5} />
                                <Typography variant="body2" color="text.secondary">ระบบกำลังทำงาน กรุณาอย่าปิดหน้านี้</Typography>
                            </Stack>
                        </Box>
                    )}

                </Card>
            </Container>
            <style>{`@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }`}</style>
        </Box>
    )
}

export default StatusPage