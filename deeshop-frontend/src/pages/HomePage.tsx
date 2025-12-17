import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Container, Typography, Box, Paper, InputBase, IconButton, Grid, Card, CardMedia, CardContent,
    Button, Chip, Stack, Divider, SvgIcon, useTheme, useMediaQuery
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import { motion, AnimatePresence } from 'framer-motion'

// --- Imports สำหรับ Snow Effect ---
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

import Navbar from '../components/Navbar'

// --- Custom Discord Icon ---
function DiscordIcon(props: any) {
    return (
        <SvgIcon {...props}>
            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.2 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.02c1.68-.53 3.42-1.33 5.19-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-9.21-3.1-11.94c-.01 0-.02-.02-.03-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
        </SvgIcon>
    );
}

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
}

const cardHoverVariants = {
    hover: { 
        y: -12,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
}

// --- Mock Data ---
const MOCK_PRODUCTS = [
    { id: 1, title: 'Valorant', category: 'Game', price: 350, maxDiscount: 5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/2560px-Valorant_logo_-_pink_color_version.svg.png', description: 'เติม VP รวดเร็วทันใจ ภายใน 1-5 นาที' },
    { id: 2, title: 'Razer Gold PIN', category: 'CashCard', price: 500, maxDiscount: 0, image: 'https://seeklogo.com/images/R/razer-gold-logo-7663249110-seeklogo.com.png', description: 'บัตรเติมเงินสำหรับเกมเมอร์ ใช้ได้ทุกค่าย' },
    { id: 3, title: 'Genshin Impact', category: 'Game', price: 179, maxDiscount: 24, image: 'https://static.vecteezy.com/system/resources/previews/027/127/497/non_2x/genshin-impact-logo-genshin-impact-icon-transparent-free-png.png', description: 'แพ็คเกจ Blessing of the Welkin Moon' },
    { id: 4, title: 'Garena Shell', category: 'CashCard', price: 1000, maxDiscount: 2.5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnRhlh__DJxuiz1NoM_rPUPz1O8G71MLAT7w&s', description: 'เติมเชลล์คุ้มๆ สำหรับ RoV, LoL, FC Online' },
    { id: 5, title: 'Steam Wallet', category: 'CashCard', price: 200, maxDiscount: 0, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png', description: 'โค้ดเติมเงิน Steam โซนไทย แท้ 100%' },
    { id: 6, title: 'RoV', category: 'Game', price: 99, maxDiscount: 5, image: 'https://downloadr2.apkmirror.com/wp-content/uploads/2018/05/5b069dc19118a-384x384.png', description: 'แพ็คคูปองสุดคุ้ม เข้าทันทีไม่ต้องรอนาน' },
    { id: 7, title: 'Zenless Zone Zero', category: 'Game', price: 99, maxDiscount: 24, image: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Zenless_Zone_Zero_initialism_logo.svg/1902px-Zenless_Zone_Zero_initialism_logo.svg.png', description: 'เติม Monochrome ราคาถูก สะดวก ปลอดภัย' },
    { id: 8, title: 'Honkai: Star Rail', category: 'Game', price: 99, maxDiscount: 24, image: 'https://upload.wikimedia.org/wikipedia/pt/9/95/Honkai_Star_Rail_logo.png', description: 'Oneiric Shard ราคาพิเศษ เติมไว' },
    { id: 9, title: 'League of Legends', category: 'Game', price: 99, maxDiscount: 5, image: 'https://wallpapers.com/images/featured/league-of-legends-icon-png-20luwm1ztdec7fkm.jpg', description: 'เติม RP ราคาคุ้มค่า สนับสนุนสกินใหม่' },
    { id: 10, title: 'Free Fire', category: 'Game', price: 99, maxDiscount: 15, image: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Logo_of_Garena_Free_Fire.png', description: 'เพชร Free Fire ราคาถูก แถมโบนัส' },
    { id: 11, title: 'PUBG Mobile', category: 'Game', price: 99, maxDiscount: 5, image: 'https://www.freeiconspng.com/thumbs/pubg/pubg-circle-battlegrounds-photo-23.png', description: 'เติม UC ราคาคุ้มค่า รวดเร็ว' },
    { id: 12, title: 'Seven Knight Re:birth', category: 'Game', price: 99, maxDiscount: 13, image: 'https://sgimage.netmarble.com/mobile/game/tskgb/brand/v1/img/1139235b7378.png', description: 'ลดสูงสุด 13% เติมง่าย ได้ไว' },
]

// --- Sub-Component: ProductSection ---
interface ProductSectionProps {
    title: string;
    products: typeof MOCK_PRODUCTS;
    onProductClick: (title: string) => void;
    showTitle?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products, onProductClick, showTitle = true }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const LIMIT = 6

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const limitCount = isMobile ? 4 : LIMIT

    if (products.length === 0) return null

    const visibleProducts = isExpanded ? products : products.slice(0, limitCount)
    const hasMore = products.length > limitCount

    return (
        <Box sx={{ mb: 6 }}>
            {showTitle && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
                        <Box sx={{ width: {xs: 30, md: 40}, height: 4, bgcolor: '#111827', borderRadius: 2, mr: 2 }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Kanit", sans-serif', letterSpacing: '-0.5px', fontSize: {xs: '1.75rem', md: '2.125rem'} }}>
                            {title}
                        </Typography>
                        <Box sx={{ width: {xs: 30, md: 40}, height: 4, bgcolor: '#111827', borderRadius: 2, ml: 2 }} />
                    </Box>
                </motion.div>
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
                    <AnimatePresence>
                        {visibleProducts.map((product) => (
                            <Grid size={{ xs: 6, sm: 6, md: 4 }} key={product.id} component={motion.div} layout>
                                <motion.div variants={itemVariants} whileHover="hover" style={{ height: '100%' }}>
                                    <Card
                                        component={motion.div}
                                        variants={cardHoverVariants}
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: '24px',
                                            border: '1px solid #E5E7EB',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                            transition: 'border-color 0.3s',
                                            '&:hover': {
                                                borderColor: '#6366f1',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}
                                        onClick={() => onProductClick(product.title)}
                                    >
                                        <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
                                            <Chip
                                                label={product.category === 'Game' ? 'GAME' : 'CARD'}
                                                size="small"
                                                sx={{
                                                    height: 24,
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                                                    backdropFilter: 'blur(4px)',
                                                    color: product.category === 'Game' ? '#7C3AED' : '#EA580C',
                                                    border: '1px solid',
                                                    borderColor: product.category === 'Game' ? '#E9D5FF' : '#FFEDD5',
                                                }}
                                            />
                                        </Box>

                                        {product.maxDiscount > 0 && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    zIndex: 10,
                                                    background: 'linear-gradient(135deg, #FF4D4D 0%, #F9CB28 100%)',
                                                    color: 'white',
                                                    padding: '6px 14px',
                                                    borderBottomLeftRadius: '20px',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    boxShadow: '-2px 2px 10px rgba(255, 77, 77, 0.3)'
                                                }}
                                            >
                                                <LocalFireDepartmentRoundedIcon sx={{ fontSize: 16, color: '#FFF' }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.8rem' }}>
                                                    -{product.maxDiscount}%
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box 
                                            sx={{ 
                                                p: 3, 
                                                display: 'flex', 
                                                justifyContent: 'center', 
                                                alignItems: 'center',
                                                // 🔥 Mobile UI: ปรับความสูงโซนรูปภาพให้เล็กลงหน่อยในมือถือ
                                                height: {xs: 150, md: 180}, 
                                                background: 'radial-gradient(circle at center, #F3F4F6 0%, #ffffff 70%)' 
                                            }}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.15 }}
                                                transition={{ type: 'spring', stiffness: 200 }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={product.image}
                                                    alt={product.title}
                                                    sx={{
                                                        width: '100%',
                                                        maxWidth: 140,
                                                        // 🔥 Mobile UI: ปรับขนาดรูปภาพให้พอดี
                                                        height: {xs: 100, md: 120},
                                                        objectFit: 'contain',
                                                        filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.15))',
                                                    }}
                                                />
                                            </motion.div>
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', px: {xs: 1.5, md: 2}, pb: 3, pt: 1 }}>
                                            {/* 🔥 Mobile UI: ปรับขนาด Font ชื่อเกม */}
                                            <Typography variant="h6" noWrap sx={{ fontWeight: 800, color: '#111827', fontSize: {xs: '1rem', md: '1.1rem'}, mb: 0.5 }}>
                                                {product.title}
                                            </Typography>
                                            
                                            {/* 🔥 Mobile UI: ปรับขนาด Font รายละเอียด */}
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                sx={{ 
                                                    fontSize: {xs: '0.8rem', md: '0.85rem'},
                                                    height: 40,
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    mb: 2
                                                }}
                                            >
                                                {product.description}
                                            </Typography>
                                            
                                            <Box sx={{ flexGrow: 1 }} />

                                            <Button 
                                                variant="outlined" 
                                                fullWidth 
                                                size="small"
                                                sx={{ 
                                                    borderRadius: '50px', 
                                                    textTransform: 'none', 
                                                    borderColor: '#E5E7EB',
                                                    color: '#374151',
                                                    fontWeight: 600,
                                                    // 🔥 Mobile UI: เพิ่มความสูงปุ่มให้กดง่ายขึ้น
                                                    py: {xs: 0.8, md: 0.5},
                                                    fontSize: {xs: '0.85rem', md: '0.8125rem'},
                                                    '&:hover': {
                                                        borderColor: '#111827',
                                                        bgcolor: '#111827',
                                                        color: 'white'
                                                    }
                                                }}
                                            >
                                                เลือกซื้อ
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            </motion.div>

            {hasMore && (
                <Box textAlign="center" mt={6}>
                    <Button
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        variant="contained"
                        onClick={() => setIsExpanded(!isExpanded)}
                        endIcon={isExpanded ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
                        sx={{
                            borderRadius: '50px',
                            textTransform: 'none',
                            px: {xs: 4, md: 5},
                            py: 1.5,
                            bgcolor: '#111827',
                            color: 'white',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontSize: {xs: '0.9rem', md: '1rem'},
                            '&:hover': { bgcolor: '#000', boxShadow: '0 6px 16px rgba(0,0,0,0.2)' }
                        }}
                    >
                        {isExpanded ? 'ย่อลง' : 'ดูเพิ่มเติมทั้งหมด'}
                    </Button>
                </Box>
            )}
        </Box>
    )
}

// --- Main Page Component ---
const HomePage = () => {
    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')

    const filteredProducts = MOCK_PRODUCTS.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const games = filteredProducts.filter(p => p.category === 'Game')
    const cards = filteredProducts.filter(p => p.category === 'CashCard')

    const handleProductClick = (title: string) => {
        navigate(`/detail/${title}`)
    }

    // 🔥 Config สำหรับ Snow Effect
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesConfig = {
        fullScreen: { enable: false }, // ไม่ให้เต็มจอ ให้ตาม Parent
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
            color: { value: "#ffffff" },
            move: {
                direction: "bottom", // หิมะตกจากบนลงล่าง
                enable: true,
                outModes: { default: "out" },
                random: false,
                speed: 2, // ความเร็วการตก
                straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 60 }, // จำนวนหิมะ
            opacity: {
                value: 0.7,
                animation: { enable: true, minimumValue: 0.3, speed: 1, sync: false } // หิมะกระพริบได้
            },
            shape: { type: "circle" }, // ทรงกลม
            size: {
                value: { min: 1, max: 4 }, // ขนาดคละกัน
            },
        },
        detectRetina: true,
    }

    return (
        <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Kanit", sans-serif' }}>
            <Navbar />

            {/* --- Hero Section --- */}
            <Box 
                sx={{ 
                    position: 'relative',
                    background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)', 
                    color: 'white', 
                    // 🔥 Mobile UI: ลด Padding บนล่างในมือถือลงเล็กน้อย
                    pt: { xs: 8, md: 12 }, 
                    pb: { xs: 10, md: 10 },
                    overflow: 'hidden',
                    mb: 4,
                    zIndex: 1
                }}
            >
                {/* 🔥 Snow Effect Component: วางไว้หลังสุด */}
                <Particles 
                    id="tsparticles" 
                    init={particlesInit} 
                    options={particlesConfig as any} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.6 }}
                />

                {/* Background Shapes (ยังคงไว้เสริมมิติ) */}
                <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, bgcolor: 'rgba(99, 102, 241, 0.15)', borderRadius: '50%', filter: 'blur(80px)', zIndex: -1 }} />
                <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, bgcolor: 'rgba(236, 72, 153, 0.15)', borderRadius: '50%', filter: 'blur(80px)', zIndex: -1 }} />

                <Container maxWidth="lg" sx={{ position: 'relative', textAlign: 'center', zIndex: 2, px: {xs: 2, md: 3} }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 900,
                                mb: 2,
                                // 🔥 Mobile UI: ปรับขนาด Font หัวข้อให้พอดีมือถือ
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                letterSpacing: '-2px',
                                textShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}
                        >
                            Deeshop <span style={{ color: '#818CF8' }}>Market</span>
                        </Typography>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                mb: 5, 
                                fontWeight: 300, 
                                opacity: 0.9, 
                                maxWidth: 600, 
                                mx: 'auto', 
                                // 🔥 Mobile UI: เพิ่มขนาด Font คำอธิบายให้อ่านง่ายขึ้น
                                fontSize: { xs: '1.1rem', md: '1.25rem' } 
                            }}
                        >
                            แหล่งรวมเกมและบัตรเติมเงินที่คุ้มค่าที่สุด รวดเร็ว ปลอดภัย 100%
                        </Typography>

                        <Paper
                            component={motion.div}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            elevation={0}
                            sx={{
                                p: '4px 8px',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                maxWidth: 600,
                                mx: 'auto',
                                borderRadius: '50px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(12px)',
                                color: 'white',
                                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                                    borderColor: 'rgba(255, 255, 255, 0.4)'
                                }
                            }}
                        >
                            <IconButton sx={{ p: '12px' }}><SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} /></IconButton>
                            <InputBase
                                sx={{ 
                                    ml: 1, 
                                    flex: 1, 
                                    fontFamily: 'inherit', 
                                    color: 'white', 
                                    fontSize: '1.1rem',
                                    '& ::placeholder': {
                                        color: 'rgba(255,255,255,0.5)',
                                        opacity: 1,
                                    }
                                }}
                                placeholder="ค้นหาเกม หรือ บัตรเติมเงิน..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Paper>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ flex: 1, pb: 8, px: {xs: 2, md: 3} }}>
                
                {/* 🔥 Mobile UI: ปรับ Margin ของ Stack ให้ไม่กินพื้นที่ Banner มากเกินไปในมือถือ */}
                <Stack 
                    direction="row" 
                    spacing={2} 
                    justifyContent="center" 
                    sx={{ 
                        mb: {xs: 6, md: 8}, 
                        mt: {xs: -5, md: -8},
                        position: 'relative', 
                        zIndex: 10
                    }} 
                >
                    {['All', 'Game', 'CashCard'].map((cat, index) => {
                        const isSelected = selectedCategory === cat
                        return (
                            <motion.div
                                key={cat}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (index * 0.1) }}
                            >
                                <Chip
                                    label={cat === 'All' ? 'ทั้งหมด' : cat === 'Game' ? 'เกมออนไลน์' : 'บัตรเติมเงิน'}
                                    clickable
                                    onClick={() => setSelectedCategory(cat)}
                                    icon={
                                        cat === 'All' ? <ShoppingCartIcon style={{ color: isSelected ? 'white' : 'inherit', fontSize: 18 }} /> :
                                        cat === 'Game' ? <SportsEsportsIcon style={{ color: isSelected ? 'white' : 'inherit', fontSize: 18 }} /> :
                                        <CreditCardIcon style={{ color: isSelected ? 'white' : 'inherit', fontSize: 18 }} />
                                    }
                                    sx={{
                                        bgcolor: isSelected ? '#4F46E5' : 'white',
                                        color: isSelected ? 'white' : '#4B5563',
                                        border: '1px solid',
                                        borderColor: isSelected ? '#4F46E5' : 'rgba(0,0,0,0.05)',
                                        borderRadius: '50px',
                                        // 🔥 Mobile UI: เพิ่ม Padding และ Font Size ให้ปุ่มกดง่ายขึ้น
                                        px: {xs: 2, md: 3},
                                        py: {xs: 2.5, md: 3},
                                        fontSize: {xs: '0.9rem', md: '1rem'},
                                        fontWeight: 600,
                                        boxShadow: isSelected ? '0 10px 20px -5px rgba(79, 70, 229, 0.4)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                        }
                                    }}
                                />
                            </motion.div>
                        )
                    })}
                </Stack>

                {selectedCategory === 'All' ? (
                    <>
                        <ProductSection title="Game Online" products={games} onProductClick={handleProductClick} />
                        <Divider sx={{ my: 6, borderStyle: 'dashed', opacity: 0.6 }} />
                        <ProductSection title="Cash Card" products={cards} onProductClick={handleProductClick} />
                    </>
                ) : (
                    <ProductSection 
                        title={selectedCategory === 'Game' ? "Game Online" : "Cash Card"} 
                        products={filteredProducts} 
                        onProductClick={handleProductClick} 
                        showTitle={false} 
                    />
                )}

                {filteredProducts.length === 0 && (
                    <Box textAlign="center" sx={{ mt: 8, py: 8, bgcolor: 'white', borderRadius: 4, border: '1px dashed #E5E7EB' }}>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                            ไม่พบสินค้าที่คุณค้นหา 😔
                        </Typography>
                        <Button
                            variant="text"
                            onClick={() => {
                                setSearchTerm('')
                                setSelectedCategory('All')
                            }}
                            sx={{ mt: 1 }}
                        >
                            ล้างคำค้นหา
                        </Button>
                    </Box>
                )}
            </Container>

            <Box sx={{ bgcolor: 'white', borderTop: '1px solid #E5E7EB', py: 6, mt: 'auto' }}>
                <Container maxWidth="lg" sx={{ px: {xs: 2, md: 3} }}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={4}
                        alignItems="center"
                        justifyContent="space-between"
                        textAlign={{ xs: 'center', md: 'left' }}
                    >
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                                Deeshop Market
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                บริการเติมเกมและบัตรเติมเงินตลอด 24 ชั่วโมง
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="contained" startIcon={<DiscordIcon />} sx={{ bgcolor: '#5865F2', color: 'white', textTransform: 'none', fontWeight: 600, px: 3, py: 1, borderRadius: '12px', boxShadow: '0 4px 10px rgba(88, 101, 242, 0.3)', '&:hover': { bgcolor: '#4752C4' } }}>Discord</Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="contained" startIcon={<FacebookRoundedIcon />} sx={{ bgcolor: '#1877F2', color: 'white', textTransform: 'none', fontWeight: 600, px: 3, py: 1, borderRadius: '12px', boxShadow: '0 4px 10px rgba(24, 119, 242, 0.3)', '&:hover': { bgcolor: '#166FE5' } }} onClick={() => window.open('https://web.facebook.com/')}>Facebook</Button>
                            </motion.div>
                        </Stack>
                    </Stack>
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="caption" color="text.secondary" display="block" align="center">
                        © 2024 Deeshop Market. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    )
}

export default HomePage