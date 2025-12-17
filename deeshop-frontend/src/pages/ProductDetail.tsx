import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Container, Typography, Box, Grid, Card, CardContent,
    Button, Chip, Stack, IconButton, TextField, Paper, InputAdornment, Divider, SvgIcon
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import TagRoundedIcon from '@mui/icons-material/TagRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'

// --- Custom Discord Icon ---
function DiscordIcon(props: any) {
    return (
        <SvgIcon {...props}>
            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.2 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.02c1.68-.53 3.42-1.33 5.19-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-9.21-3.1-11.94c-.01 0-.02-.02-.03-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
        </SvgIcon>
    );
}

interface PackageData {
    id: number;
    value: number;
    unit: string;
    fullPrice: number;
    discount?: number;
    price?: number | null;
    // cost: number; // ❌ ลบ Cost ออกจาก Mock Data ตามโจทย์
    featured: boolean;
}

const GAME_METADATA: Record<string, { type: 'Game' | 'CashCard' }> = {
    'Valorant': { type: 'Game' },
    'RoV': { type: 'Game' },
    'Genshin Impact': { type: 'Game' },
    'Free Fire': { type: 'Game' },
    'League of Legends': { type: 'Game' },
    'PUBG Mobile': { type: 'Game' },
    'Zenless Zone Zero': { type: 'Game' },
    'Honkai: Star Rail': { type: 'Game' },
    'Razer Gold PIN': { type: 'CashCard' },
    'Garena Shell': { type: 'CashCard' },
    'Steam Wallet': { type: 'CashCard' },
    'TrueMoney': { type: 'CashCard' },
    'Default': { type: 'Game' }
}

// 🔥 เพิ่ม: ตัวแปรเก็บ % ส่วนลดต้นทุนจาก Supplier (แยกออกมาต่างหาก)
// ความหมาย: เราซื้อของมาได้ถูกกว่าราคาป้ายกี่ % (Margin ของเรา)
const GAME_SUPPLIER_DISCOUNTS: Record<string, number> = {
    'Valorant': 5,      // เราได้ส่วนลด 20% จากราคาเต็ม
    'RoV': 5.25,           // เราได้ส่วนลด 15%
    'Steam Wallet': 5,  // เราได้ส่วนลด 10%
    'Default': 5        // ค่าเริ่มต้น
}

// Mock Data (เหลือแค่ราคาขายหน้าเว็บ)
const GAME_PACKAGES: Record<string, PackageData[]> = {
    'Valorant': [
        { id: 1, value: 475, unit: 'VP', fullPrice: 130, price: 0, discount: 5, featured: false },
        { id: 2, value: 1000, unit: 'VP', fullPrice: 260, price: 0, discount: 5, featured: false },
        { id: 3, value: 2050, unit: 'VP', fullPrice: 520, price: 0, discount: 5, featured: false },
        { id: 4, value: 3650, unit: 'VP', fullPrice: 920, price: 0, discount: 5, featured: false },
        { id: 5, value: 5350, unit: 'VP', fullPrice: 1320, price: 0, discount: 5, featured: false },
        { id: 6, value: 11000, unit: 'VP', fullPrice: 2640, price: 0, discount: 5, featured: false },
    ],
    'RoV': [
        { id: 1, value: 11, unit: 'คูปอง', fullPrice: 10, price: 9.5, featured: false },
        { id: 2, value: 24, unit: 'คูปอง', fullPrice: 20, price: 19, featured: false },
        { id: 3, value: 60, unit: 'คูปอง', fullPrice: 50, discount: 5.25, featured: false },
        { id: 4, value: 110, unit: 'คูปอง', fullPrice: 90, discount: 5.25, featured: false },
        { id: 5, value: 185, unit: 'คูปอง', fullPrice: 150, price: 142, featured: false },
        { id: 6, value: 370, unit: 'คูปอง', fullPrice: 300, discount: 5.25, featured: false },
        { id: 7, value: 620, unit: 'คูปอง', fullPrice: 500, price: 475, discount: 5.25, featured: true },
        { id: 8, value: 1240, unit: 'คูปอง', fullPrice: 1000, price: 950, discount: 0, featured: false },
    ],
    'Steam Wallet': [
        { id: 1, value: 50, unit: 'THB', fullPrice: 50, price: 50, discount: 0, featured: false },
        { id: 2, value: 200, unit: 'THB', fullPrice: 200, price: 200, discount: 0, featured: false },
        { id: 3, value: 350, unit: 'THB', fullPrice: 350, price: 350, discount: 0, featured: true },
        { id: 4, value: 1000, unit: 'THB', fullPrice: 1000, price: 1000, discount: 0, featured: false },
    ],
    'Default': [
        { id: 1, value: 1, unit: 'Starter Pack', fullPrice: 100, discount: 0, featured: false },
        { id: 2, value: 1, unit: 'Pro Pack', fullPrice: 550, discount: 10, featured: true },
        { id: 3, value: 1, unit: 'Ultra Pack', fullPrice: 1200, price: 999, featured: false },
    ]
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
        style: 'decimal',
        minimumFractionDigits: price % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2
    }).format(price)
}

const ProductDetail = () => {
    const { gameId } = useParams()
    const navigate = useNavigate()

    const packages = GAME_PACKAGES[gameId || ''] || GAME_PACKAGES['Default']
    const metadata = GAME_METADATA[gameId || ''] || GAME_METADATA['Default']
    const isGame = metadata.type === 'Game'

    const [playerInfo, setPlayerInfo] = useState({ uid: '', riotId: '', tag: '' })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerInfo({ ...playerInfo, [e.target.name]: e.target.value })
    }

    const handleBuyClick = (pkg: PackageData, finalPrice: number, trueCost: number, discountReason: string) => {
        if (isGame) {
            const isValorant = gameId === 'Valorant'
            if (isValorant) {
                if (!playerInfo.riotId || !playerInfo.tag) {
                    alert('กรุณากรอก Riot ID และ Tag ให้ครบถ้วน')
                    return
                }
            } else {
                if (!playerInfo.uid) {
                    alert('กรุณากรอก UID / OpenID')
                    return
                }
            }
        }

        // ส่งข้อมูลไปยังหน้า Payment (รวมถึงต้นทุนที่คำนวณได้)
        navigate(`/checkout/${gameId}/${pkg.id}`, { 
            state: { 
                playerInfo: isGame ? playerInfo : null,
                pkgName: `${pkg.value.toLocaleString()} ${pkg.unit}`,
                finalPrice,
                fullPrice: pkg.fullPrice,
                cost: trueCost, // 🔥 ส่งค่าต้นทุนที่คำนวณแล้ว
                discountReason,
                isGame 
            } 
        })
    }

    const renderPlayerInput = () => {
        const isValorant = gameId === 'Valorant'
        if (isValorant) {
            return (
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}> 
                        <TextField
                            fullWidth label="Riot ID" name="riotId" placeholder="ชื่อในเกม"
                            value={playerInfo.riotId} onChange={handleInputChange}
                            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircleRoundedIcon color="action" /></InputAdornment>) }}
                            sx={{ bgcolor: 'white' }}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth label="Tag" name="tag" placeholder="#1234"
                            value={playerInfo.tag} onChange={handleInputChange}
                            InputProps={{ startAdornment: (<InputAdornment position="start"><TagRoundedIcon color="action" fontSize="small" /></InputAdornment>) }}
                            sx={{ bgcolor: 'white' }}
                        />
                    </Grid>
                </Grid>
            )
        } else {
            return (
                <TextField
                    fullWidth label="UID / OpenID" name="uid" placeholder="กรอกเลข UID ของคุณ"
                    value={playerInfo.uid} onChange={handleInputChange}
                    helperText="สามารถดู UID ได้ที่หน้าตั้งค่าภายในเกม"
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><AccountCircleRoundedIcon color="action" /></InputAdornment>),
                        endAdornment: (<InputAdornment position="end"><IconButton edge="end" size="small"><InfoOutlinedIcon fontSize="small" /></IconButton></InputAdornment>)
                    }}
                    sx={{ bgcolor: 'white' }}
                />
            )
        }
    }

    // ดึง % ส่วนลดต้นทุนของเกมนี้
    const supplierDiscountPercent = GAME_SUPPLIER_DISCOUNTS[gameId || ''] || GAME_SUPPLIER_DISCOUNTS['Default']

    return (
        <Box sx={{ background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f3f4f6 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Kanit", sans-serif' }}>
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, flex: 1 }}>
                
                <Box mb={{ xs: 3, md: 6 }} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                            <IconButton onClick={() => navigate(-1)} sx={{ width: 40, height: 40, bgcolor: 'white', border: '1px solid #E5E7EB', '&:hover': { bgcolor: '#F9FAFB', transform: 'translateX(-2px)' } }}>
                                <ArrowBackRoundedIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #111827 30%, #4B5563 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px', fontSize: { xs: '1.75rem', md: '2.5rem' }, lineHeight: 1 }}>
                                {gameId || 'Premium Store'}
                            </Typography>
                        </Stack>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, fontSize: { xs: '0.875rem', md: '1rem' }, pl: { xs: 0, md: 0.5 } }}>
                            {isGame ? 'กรอก ID และเลือกแพ็กเกจที่ต้องการเติม' : 'เลือกราคาบัตรเติมเงินที่ต้องการซื้อ'}
                        </Typography>
                    </Stack>
                </Box>

                {isGame && (
                    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: { xs: 3, md: 4 }, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                        <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box sx={{ width: 4, height: 24, bgcolor: '#111827', borderRadius: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', fontFamily: '"Kanit", sans-serif' }}>ข้อมูลบัญชีผู้ใช้</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: -1, ml: 1.5 }}>กรุณากรอกข้อมูลให้ถูกต้องเพื่อความรวดเร็วในการเติม</Typography>
                            <Box sx={{ mt: 1 }}>{renderPlayerInput()}</Box>
                        </Stack>
                    </Paper>
                )}

                <Divider sx={{ mb: 4, borderColor: '#E5E7EB', borderStyle: 'dashed' }}>
                    <Chip label="เลือกแพ็กเกจ" size="small" sx={{ bgcolor: '#F3F4F6', color: '#6B7280', fontWeight: 500 }} />
                </Divider>

                <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} alignItems="stretch">
                    {packages.map((pkg) => {
                        // 1. คำนวณราคาขาย (Final Price)
                        let finalPrice = 0
                        let discountPercent = 0
                        let discountReason = '-' 

                        if (pkg.price != null && pkg.price > 1) {
                            finalPrice = pkg.price
                            discountReason = 'ราคาพิเศษ' 
                            if (pkg.fullPrice > 0) {
                                discountPercent = ((pkg.fullPrice - finalPrice) / pkg.fullPrice) * 100
                            }
                        } else if (pkg.discount != null && pkg.discount > 0) {
                            discountPercent = pkg.discount
                            finalPrice = pkg.fullPrice - (pkg.fullPrice * (discountPercent / 100))
                            discountReason = `ส่วนลด ${discountPercent}%` 
                        } else {
                            finalPrice = pkg.fullPrice
                        }

                        // 2. 🔥 คำนวณต้นทุน (True Cost) ตามโจทย์
                        // สูตร: TrueCost = FullPrice - (FullPrice * SupplierDiscount%)
                        const supplierDiscountAmount = (pkg.fullPrice * supplierDiscountPercent) / 100
                        const trueCost = pkg.fullPrice - supplierDiscountAmount

                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pkg.id}>
                                <Card elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '24px', position: 'relative', bgcolor: 'white', border: pkg.featured ? '2px solid transparent' : '1px solid #F3F4F6', backgroundClip: pkg.featured ? 'padding-box, border-box' : 'padding-box', backgroundImage: pkg.featured ? `linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)` : 'none', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: pkg.featured ? '0 10px 40px -10px rgba(99, 102, 241, 0.25)' : '0 4px 20px -12px rgba(0, 0, 0, 0.05)', overflow: 'visible', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)', borderColor: pkg.featured ? 'transparent' : 'transparent' } }}>
                                    {discountPercent > 0 && (
                                        <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 10, background: 'linear-gradient(135deg, #FF4D4D 0%, #F9CB28 100%)', color: 'white', padding: '8px 16px', borderBottomLeftRadius: '20px', boxShadow: '-4px 4px 15px rgba(255, 77, 77, 0.4)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5, borderTopRightRadius: '24px' }}>
                                            <LocalFireDepartmentRoundedIcon sx={{ fontSize: 18, color: '#FFF' }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>-{discountPercent.toLocaleString('en-US', { maximumFractionDigits: 0 })}%</Typography>
                                        </Box>
                                    )}
                                    {pkg.featured && (
                                        <Chip icon={<AutoAwesomeRoundedIcon style={{ fontSize: 10 }} />} label="ขายดี" size="small" sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', bgcolor: '#1F2937', color: 'white', fontWeight: 600, fontSize: { xs: '0.6rem', md: '0.75rem' }, height: { xs: 20, md: 28 }, px: { xs: 0, md: 1 }, boxShadow: '0 4px 10px rgba(0,0,0,0.15)', border: '2px solid white', zIndex: 20, '& .MuiChip-icon': { color: 'white', mr: -0.5 } }} />
                                    )}
                                    <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3.5 }, pb: { xs: 1.5, sm: 2, md: 3.5 } + ' !important', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" noWrap sx={{ fontWeight: 600, color: '#374151', lineHeight: 1.3, mb: 0.5, mt: 3, fontSize: { xs: '0.75rem', md: '1.1rem' }, fontFamily: '"Kanit", sans-serif' }}>{pkg.value.toLocaleString()} {pkg.unit}</Typography>
                                            <Stack direction="row" alignItems="baseline" justifyContent="center" spacing={1} sx={{ mt: { xs: 1, md: 2 } }}>
                                                <Typography variant="h3" sx={{ fontWeight: 800, color: pkg.featured ? '#4F46E5' : '#111827', letterSpacing: '-1px', fontSize: { xs: '1.25rem', md: '2rem' }, fontFamily: '"Kanit", sans-serif' }}>
                                                    {formatPrice(finalPrice)}<Typography component="span" sx={{ fontSize: { xs: '0.75rem', md: '1.1rem' }, fontWeight: 600, ml: 0.7, color: '#6B7280' }}>฿</Typography>
                                                </Typography>
                                                {discountPercent > 0 && (
                                                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#9CA3AF', fontWeight: 500, fontSize: { xs: '0.65rem', md: '0.9rem' } }}>{formatPrice(pkg.fullPrice)}</Typography>
                                                )}
                                            </Stack>
                                        </Box>
                                        <Button fullWidth disableElevation variant={pkg.featured ? "contained" : "outlined"} startIcon={!pkg.featured ? <LocalMallRoundedIcon sx={{ display: { xs: 'none', md: 'block' }, fontSize: 18 }} /> : null} onClick={() => handleBuyClick(pkg, finalPrice, trueCost, discountReason)} sx={{ mt: 2, borderRadius: '50px', py: { xs: 0.5, md: 1.2 }, textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.75rem', md: '1rem' }, fontFamily: '"Kanit", sans-serif', boxShadow: 'none', bgcolor: pkg.featured ? '#111827' : 'transparent', borderColor: pkg.featured ? 'transparent' : '#E5E7EB', color: pkg.featured ? 'white' : '#374151', minWidth: 0, transition: 'all 0.2s', '&:hover': { bgcolor: pkg.featured ? 'black' : '#F9FAFB', borderColor: pkg.featured ? 'transparent' : '#D1D5DB', transform: 'scale(1.02)' } }}>{pkg.featured ? 'ซื้อ' : 'เลือก'}</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
            <Box sx={{ bgcolor: 'white', borderTop: '1px solid #E5E7EB', py: 4, mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>Contact Us</Typography>
                            <Typography variant="body2" color="text.secondary">สอบถามปัญหา หรือติดตามข่าวสารโปรโมชั่น</Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" startIcon={<DiscordIcon />} sx={{ bgcolor: '#5865F2', color: 'white', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: '12px', '&:hover': { bgcolor: '#4752C4' } }}>Discord</Button>
                            <Button variant="contained" startIcon={<FacebookRoundedIcon />} sx={{ bgcolor: '#1877F2', color: 'white', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: '12px', '&:hover': { bgcolor: '#166FE5' } }}>Facebook</Button>
                        </Stack>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" display="block" align="center" sx={{ mt: 4 }}>© 2024 Deeshop Market. All rights reserved.</Typography>
                </Container>
            </Box>
        </Box>
    )
}

export default ProductDetail