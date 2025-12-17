import React, { useState, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
    Container, Typography, Box, Grid, Card, CardContent,
    Button, Stack, IconButton, Divider, Radio, Avatar,
    Dialog, DialogContent, DialogTitle, Slide, useTheme, useMediaQuery,
    CircularProgress, Alert, Snackbar, Tooltip
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SaveAltRoundedIcon from '@mui/icons-material/SaveAltRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded' // ไอคอน Copy
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded' // ไอคอนธนาคาร
import type { TransitionProps } from '@mui/material/transitions'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const formatPriceDisplay = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price)
}

const PaymentPage = () => {
    const { gameId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    // สำหรับ Check Slip
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isCheckingSlip, setIsCheckingSlip] = useState(false)
    const [toastOpen, setToastOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState({ type: 'success', text: '' })

    // ข้อมูลบัญชีธนาคาร (Hardcode ตามโจทย์)
    const bankInfo = {
        accNo: '1788721818',
        accName: 'ตันติกร พุ่มเหรียญ',
        bankName: 'ธนาคารกสิกรไทย (KBank)' // เดาจากเลข 178 มักเป็น KBank แต่ถ้าไม่ใช่แก้ตรงนี้ได้ครับ
    }

    const {
        playerInfo = { riotId: '', uid: '', tag: '' },
        finalPrice = 0,
        fullPrice = 0,
        cost = 0,
        discountReason = '-',
        pkgName = 'Unknown Package'
    } = location.state || {}

    const [paymentMethod, setPaymentMethod] = useState('qrcode')
    const [openQr, setOpenQr] = useState(false)

    const rawPrice = Number(finalPrice) || 0
    const fixedPrice = (Math.ceil(rawPrice * 100) / 100).toFixed(2)
    const qrCodeUrl = `https://promptpay.io/0969263255/${fixedPrice}`

    if (!location.state) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Stack spacing={2} alignItems="center">
                    <Typography>ไม่พบข้อมูลคำสั่งซื้อ</Typography>
                    <Button variant="contained" onClick={() => navigate('/')}>กลับหน้าหลัก</Button>
                </Stack>
            </Box>
        )
    }

    const handleCopyAccNo = () => {
        navigator.clipboard.writeText(bankInfo.accNo)
        setToastMessage({ type: 'success', text: 'คัดลอกเลขบัญชีแล้ว' })
        setToastOpen(true)
    }

    const handlePaymentAction = () => {
        if (paymentMethod === 'qrcode') {
            setOpenQr(true)
        } else if (paymentMethod === 'checkslip') {
            fileInputRef.current?.click()
        } else {
            alert('ระบบ TrueMoney Wallet กำลังปิดปรับปรุง')
        }
    }

    const finalizeOrder = () => {
        const orderId = Math.floor(100000 + Math.random() * 900000).toString()
        let finalPlayerId = '-'
        if (playerInfo.riotId && playerInfo.riotId.trim() !== '') {
            finalPlayerId = `${playerInfo.riotId}#${playerInfo.tag}`
        } else if (playerInfo.uid && playerInfo.uid.trim() !== '') {
            finalPlayerId = playerInfo.uid
        }

        const newOrder = {
            id: orderId,
            game: gameId,
            package: pkgName,
            price: finalPrice,
            fullPrice: fullPrice,
            cost: cost,
            discountReason: discountReason,
            playerId: finalPlayerId,
            status: 'PENDING',
            timestamp: new Date().toISOString()
        }

        const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
        localStorage.setItem('mock_orders', JSON.stringify([newOrder, ...existingOrders]))

        setOpenQr(false)
        navigate(`/status/${orderId}`)
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsCheckingSlip(true)
        const formData = new FormData()
        formData.append('files', file)

        try {
            const response = await fetch('/slipok-proxy/api/line/apikey/57820', {
                method: 'POST',
                headers: {
                    'x-authorization': 'SLIPOKV8249N9'
                },
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                const slipAmount = data.data.amount
                const expectedAmount = parseFloat(fixedPrice)

                if (slipAmount >= expectedAmount) {
                    setToastMessage({ type: 'success', text: 'ตรวจสอบสลิปสำเร็จ! กำลังทำรายการ...' })
                    setToastOpen(true)
                    setTimeout(() => finalizeOrder(), 1500)
                } else {
                    setToastMessage({ type: 'error', text: `ยอดเงินไม่ครบ (สลิป: ${slipAmount}, ต้องจ่าย: ${expectedAmount})` })
                    setToastOpen(true)
                }
            } else {
                setToastMessage({ type: 'error', text: 'สลิปไม่ถูกต้อง หรือ เคยใช้ไปแล้ว' })
                setToastOpen(true)
            }

        } catch (error) {
            console.error('Slip Check Error:', error)
            setToastMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ Server' })
            setToastOpen(true)
        } finally {
            setIsCheckingSlip(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleConfirmPaymentQRCode = () => {
        finalizeOrder()
    }

    return (
        <Box sx={{ background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f3f4f6 100%)', minHeight: '100vh', py: { xs: 3, md: 6 }, fontFamily: '"Kanit", sans-serif' }}>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

            <Container maxWidth="lg">
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'white', border: '1px solid #E5E7EB', '&:hover': { bgcolor: '#F9FAFB' } }}><ArrowBackRoundedIcon /></IconButton>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>ชำระเงิน</Typography>
                        <Typography variant="body2" color="text.secondary">เลือกช่องทางการชำระเงินและตรวจสอบรายการ</Typography>
                    </Box>
                </Stack>

                <Grid container spacing={4}>
                    {/* Left Column: Payment Methods */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card elevation={0} sx={{ borderRadius: '24px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                            <Box sx={{ p: 3, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>เลือกช่องทางชำระเงิน</Typography>
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Stack spacing={2}>
                                    <Box onClick={() => setPaymentMethod('qrcode')} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '16px', border: '2px solid', borderColor: paymentMethod === 'qrcode' ? '#111827' : '#E5E7EB', bgcolor: paymentMethod === 'qrcode' ? '#F3F4F6' : 'white', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: paymentMethod === 'qrcode' ? '#111827' : '#D1D5DB' } }}>
                                        <Avatar sx={{ bgcolor: '#E0E7FF', color: '#4338CA', mr: 2 }}><QrCodeScannerRoundedIcon /></Avatar>
                                        <Box sx={{ flexGrow: 1 }}><Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Thai QR Payment</Typography><Typography variant="caption" color="text.secondary">สแกนจ่ายผ่านแอปธนาคาร ฟรีค่าธรรมเนียม</Typography></Box>
                                        <Radio checked={paymentMethod === 'qrcode'} sx={{ color: '#111827', '&.Mui-checked': { color: '#111827' } }} />
                                    </Box>

                                    <Box onClick={() => setPaymentMethod('checkslip')} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '16px', border: '2px solid', borderColor: paymentMethod === 'checkslip' ? '#059669' : '#E5E7EB', bgcolor: paymentMethod === 'checkslip' ? '#ECFDF5' : 'white', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: paymentMethod === 'checkslip' ? '#059669' : '#D1D5DB' } }}>
                                        <Avatar sx={{ bgcolor: '#D1FAE5', color: '#059669', mr: 2 }}><ReceiptLongRoundedIcon /></Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>แจ้งโอนเงิน (Check Slip)</Typography>
                                            <Typography variant="caption" color="text.secondary">โอนเงินและอัปโหลดสลิปเพื่อตรวจสอบทันที</Typography>
                                        </Box>
                                        <Radio checked={paymentMethod === 'checkslip'} sx={{ color: '#059669', '&.Mui-checked': { color: '#059669' } }} />
                                    </Box>

                                    <Box onClick={() => setPaymentMethod('truemoney')} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '16px', border: '2px solid', borderColor: paymentMethod === 'truemoney' ? '#FF9100' : '#E5E7EB', bgcolor: paymentMethod === 'truemoney' ? '#FFF3E0' : 'white', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: paymentMethod === 'truemoney' ? '#FF9100' : '#D1D5DB' } }}>
                                        <Avatar sx={{ bgcolor: '#FFF3E0', color: '#FF9100', mr: 2 }}><AccountBalanceWalletRoundedIcon /></Avatar>
                                        <Box sx={{ flexGrow: 1 }}><Typography variant="subtitle1" sx={{ fontWeight: 700 }}>TrueMoney Wallet</Typography><Typography variant="caption" color="text.secondary">ชำระผ่านแอปทรูมันนี่ (อาจมีค่าธรรมเนียม)</Typography></Box>
                                        <Radio checked={paymentMethod === 'truemoney'} sx={{ color: '#FF9100', '&.Mui-checked': { color: '#FF9100' } }} />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column: Summary */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card elevation={0} sx={{ borderRadius: '24px', border: '1px solid #E5E7EB', position: 'sticky', top: 20 }}>
                            <Box sx={{ p: 3, bgcolor: '#111827', color: 'white' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>สรุปรายการ</Typography>
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                                    <Avatar variant="rounded" sx={{ width: 60, height: 60, bgcolor: '#F3F4F6', color: '#111827', fontWeight: 'bold' }}>{gameId?.charAt(0)}</Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{gameId}</Typography>
                                        <Typography variant="body2" color="text.secondary">{pkgName}</Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                                {(playerInfo.riotId || playerInfo.uid) && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>ข้อมูลบัญชี</Typography>
                                        {playerInfo.riotId ? (
                                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                                                <Typography variant="body2" color="text.secondary">Riot ID:</Typography>
                                                <Typography variant="body2" fontWeight={600}>{playerInfo.riotId} #{playerInfo.tag}</Typography>
                                            </Stack>
                                        ) : (
                                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                                                <Typography variant="body2" color="text.secondary">UID:</Typography>
                                                <Typography variant="body2" fontWeight={600}>{playerInfo.uid}</Typography>
                                            </Stack>
                                        )}
                                    </Box>
                                )}

                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">ราคาสินค้า (เต็ม)</Typography>
                                        <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>{formatPriceDisplay(fullPrice)} ฿</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">ส่วนลด</Typography>
                                        <Typography variant="body2" color="error">{discountReason}</Typography>
                                    </Stack>
                                    <Divider />
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>ยอดรวมสุทธิ</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>{formatPriceDisplay(parseFloat(fixedPrice))} ฿</Typography>
                                    </Stack>
                                </Stack>

                                {/* --- ส่วนแสดงเลขบัญชี กรณีเลือก Check Slip --- */}
                                {paymentMethod === 'checkslip' && (
                                    <Box sx={{ mt: 3, mb: 1, p: 2, bgcolor: '#ECFDF5', borderRadius: '16px', border: '1px dashed #059669' }}>
                                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                            <AccountBalanceRoundedIcon sx={{ fontSize: 20, color: '#059669' }} />
                                            <Typography variant="subtitle2" sx={{ color: '#059669', fontWeight: 700 }}>
                                                โอนเงินเข้าบัญชี
                                            </Typography>
                                        </Stack>
                                        <Box sx={{ pl: 1 }}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#064E3B', letterSpacing: 0.5 }}>
                                                    {bankInfo.accNo.replace(/(\d{3})(\d{1})(\d{5})(\d{1})/, '$1-$2-$3-$4')}
                                                </Typography>
                                                <Tooltip title="คัดลอกเลขบัญชี">
                                                    <IconButton size="small" onClick={handleCopyAccNo} sx={{ color: '#059669', bgcolor: 'white' }}>
                                                        <ContentCopyRoundedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                            <Typography variant="body2" sx={{ color: '#064E3B', fontWeight: 500, mt: 0.5 }}>
                                                {bankInfo.accName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#059669', opacity: 0.8 }}>
                                                {bankInfo.bankName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                                {/* --------------------------------------- */}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={isCheckingSlip ? <CircularProgress size={20} color="inherit" /> : (paymentMethod === 'checkslip' ? <CloudUploadRoundedIcon /> : <CheckCircleRoundedIcon />)}
                                    onClick={handlePaymentAction}
                                    disabled={isCheckingSlip}
                                    sx={{
                                        mt: paymentMethod === 'checkslip' ? 2 : 4, // ลดระยะห่างลงเล็กน้อยถ้ามีกล่องเลขบัญชี
                                        bgcolor: paymentMethod === 'checkslip' ? '#059669' : '#111827',
                                        color: 'white',
                                        borderRadius: '16px',
                                        fontWeight: 700,
                                        py: 1.5,
                                        '&:hover': { bgcolor: paymentMethod === 'checkslip' ? '#047857' : '#000' }
                                    }}
                                >
                                    {isCheckingSlip ? 'กำลังตรวจสอบ...' : (paymentMethod === 'checkslip' ? 'แนบสลิปเพื่อตรวจสอบ' : `ชำระเงิน (${paymentMethod === 'qrcode' ? 'QR Code' : 'Wallet'})`)}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Dialog open={openQr} TransitionComponent={Transition} keepMounted onClose={() => setOpenQr(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 24, padding: isMobile ? 0 : 8 } }}>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 1 }}>
                        <Typography component="div" variant="h6" fontWeight={700}>สแกนเพื่อชำระเงิน</Typography>
                        <IconButton onClick={() => setOpenQr(false)} size="small" sx={{ bgcolor: '#F3F4F6' }}><CloseRoundedIcon /></IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ bgcolor: '#1A365D', color: 'white', p: 4, borderRadius: '20px', mb: 3 }}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ mb: 3 }}>
                                <Box sx={{ bgcolor: 'white', p: 0.5, borderRadius: 1, display: 'flex' }}><QrCodeScannerRoundedIcon sx={{ color: '#1A365D' }} /></Box>
                                <Typography variant="h5" fontWeight={800} letterSpacing={1}>PromptPay</Typography>
                            </Stack>
                            <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '16px', display: 'inline-block' }}>
                                <img src={qrCodeUrl} alt="PromptPay QR Code" style={{ width: '100%', maxWidth: '250px', height: 'auto', display: 'block', borderRadius: '8px' }} />
                            </Box>
                            <Box mt={3}>
                                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>ยอดชำระ (ปัดเศษขึ้น)</Typography>
                                <Typography variant="h3" fontWeight={800} sx={{ mt: 0.5 }}>{formatPriceDisplay(parseFloat(fixedPrice))} <span style={{ fontSize: '1rem', fontWeight: 600 }}>THB</span></Typography>
                                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>096-926-3255</Typography>
                            </Box>
                        </Box>
                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                            <Button variant="outlined" startIcon={<SaveAltRoundedIcon />} sx={{ borderRadius: '50px', textTransform: 'none', px: 3 }} onClick={() => window.open(qrCodeUrl, '_blank')} autoFocus>บันทึกรูป</Button>
                            <Button variant="contained" sx={{ borderRadius: '50px', textTransform: 'none', px: 3, bgcolor: '#111827' }} onClick={handleConfirmPaymentQRCode}>ฉันชำระเงินแล้ว</Button>
                        </Stack>
                    </DialogContent>
                </Dialog>

                <Snackbar open={toastOpen} autoHideDuration={6000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={() => setToastOpen(false)} severity={toastMessage.type as any} sx={{ width: '100%', borderRadius: '12px', boxShadow: 3 }}>
                        {toastMessage.text}
                    </Alert>
                </Snackbar>

            </Container>
        </Box>
    )
}

export default PaymentPage