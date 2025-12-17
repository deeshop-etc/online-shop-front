import React, { useState, useEffect } from 'react'
import {
    Container, Typography, Box, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip, Paper, IconButton, Stack,
    Grid, Card, CardContent
} from '@mui/material'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded' // Icon กำไร
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

// ฟังก์ชันจัดรูปแบบเงิน
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price)
}

const AdminPage = () => {
    const [orders, setOrders] = useState<any[]>([])

    const loadOrders = () => {
        const savedData = localStorage.getItem('mock_orders')
        if (savedData) setOrders(JSON.parse(savedData))
    }

    useEffect(() => { loadOrders() }, [])

    const updateStatus = (orderId: string, newStatus: string) => {
        const updatedOrders = orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
        localStorage.setItem('mock_orders', JSON.stringify(updatedOrders))
        setOrders(updatedOrders)
    }

    const clearAll = () => {
        if(window.confirm('ลบข้อมูลทั้งหมด?')) {
            localStorage.removeItem('mock_orders')
            setOrders([])
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'PROCESSING': return 'primary';
            case 'REJECTED': return 'error';
            default: return 'warning';
        }
    }

    // --- 📊 คำนวณยอดขายและกำไร ---
    const completedOrders = orders.filter(o => o.status === 'COMPLETED')
    
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0)
    // กำไร = ราคาขาย (price) - ต้นทุน (cost)
    const totalProfit = completedOrders.reduce((sum, o) => sum + ((Number(o.price) || 0) - (Number(o.cost) || 0)), 0)

    const pendingCount = orders.filter(o => o.status === 'PENDING').length
    const completedCount = orders.filter(o => o.status === 'COMPLETED').length

    return (
        <Container maxWidth="xl" sx={{ py: 8, fontFamily: '"Kanit", sans-serif' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight={800}>Admin Dashboard 🛠️</Typography>
                <Box>
                    <IconButton onClick={loadOrders} sx={{ mr: 2 }}><RefreshRoundedIcon /></IconButton>
                    <Button variant="outlined" color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={clearAll}>Reset Data</Button>
                </Box>
            </Box>

            {/* --- Dashboard Stats --- */}
            <Grid container spacing={3} mb={4}>
                {/* Revenue Card */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 4, height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>ยอดขายรวม</Typography>
                                <Typography variant="h5" fontWeight={800} color="primary.main">{formatPrice(totalRevenue)} ฿</Typography>
                            </Box>
                            <Box sx={{ p: 1.5, bgcolor: '#EFF6FF', borderRadius: '12px', color: '#2563EB' }}><AttachMoneyRoundedIcon /></Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 🔥 Profit Card (New) */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 4, height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>กำไรสุทธิ</Typography>
                                <Typography variant="h5" fontWeight={800} color="success.main">{formatPrice(totalProfit)} ฿</Typography>
                            </Box>
                            <Box sx={{ p: 1.5, bgcolor: '#ECFDF5', borderRadius: '12px', color: '#059669' }}><TrendingUpRoundedIcon /></Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pending Orders Card */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 4, height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>รอตรวจสอบ</Typography>
                                <Typography variant="h5" fontWeight={800} color="warning.main">{pendingCount} รายการ</Typography>
                            </Box>
                            <Box sx={{ p: 1.5, bgcolor: '#FFFBEB', borderRadius: '12px', color: '#D97706' }}><AccessTimeRoundedIcon /></Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Completed Orders Card */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 4, height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>สำเร็จแล้ว</Typography>
                                <Typography variant="h5" fontWeight={800} color="text.primary">{completedCount} รายการ</Typography>
                            </Box>
                            <Box sx={{ p: 1.5, bgcolor: '#F3F4F6', borderRadius: '12px', color: '#374151' }}><CheckCircleOutlineRoundedIcon /></Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ตารางรายการ */}
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 4 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Game / Package</TableCell>
                            <TableCell>Player ID</TableCell>
                            <TableCell>ราคาเต็ม</TableCell>
                            <TableCell>ส่วนลด</TableCell>
                            <TableCell>ยอดชำระ</TableCell>
                            <TableCell>ต้นทุน</TableCell> {/* แสดงต้นทุนให้แอดมินเห็นด้วยก็ได้ */}
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>ไม่มีรายการคำสั่งซื้อ</TableCell></TableRow>
                        ) : (
                            orders.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>#{row.id}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{row.game}</Typography>
                                        <Typography variant="caption" color="text.secondary">{row.package}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.playerId} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell sx={{ textDecoration: 'line-through', color: '#9CA3AF' }}>
                                        {row.fullPrice ? formatPrice(row.fullPrice) : '-'}
                                    </TableCell>
                                    <TableCell sx={{ color: 'error.main', fontSize: '0.875rem' }}>
                                        {row.discountReason || '-'}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#111827' }}>
                                        {formatPrice(row.price)} ฿
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                        {formatPrice(row.cost || 0)} ฿
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            {row.status === 'PENDING' && (
                                                <>
                                                    <Button variant="contained" size="small" onClick={() => updateStatus(row.id, 'PROCESSING')} sx={{ bgcolor: '#3B82F6' }}>รับงาน</Button>
                                                    <Button variant="outlined" size="small" color="error" onClick={() => updateStatus(row.id, 'REJECTED')}>ปฏิเสธ</Button>
                                                </>
                                            )}
                                            {row.status === 'PROCESSING' && (
                                                <Button variant="contained" size="small" color="success" onClick={() => updateStatus(row.id, 'COMPLETED')}>เสร็จสิ้น</Button>
                                            )}
                                            {row.status === 'COMPLETED' && <Typography variant="caption" color="success.main">เรียบร้อย</Typography>}
                                            {row.status === 'REJECTED' && <Typography variant="caption" color="error.main">ถูกปฏิเสธ</Typography>}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default AdminPage