import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Typography,
    Box,
    Paper,
    InputBase,
    IconButton,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    Chip,
    Stack,
    Divider,
    SvgIcon
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'

// --- Custom Discord Icon (เนื่องจาก MUI ไม่มีให้) ---
function DiscordIcon(props: any) {
    return (
        <SvgIcon {...props}>
            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.2 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.02c1.68-.53 3.42-1.33 5.19-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-9.21-3.1-11.94c-.01 0-.02-.02-.03-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
        </SvgIcon>
    );
}

// --- Mock Data ---
const MOCK_PRODUCTS = [
    {
        id: 1,
        title: 'Valorant',
        category: 'Game',
        price: 350,
        maxDiscount: 5,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/2560px-Valorant_logo_-_pink_color_version.svg.png',
        description: 'อาจจะใช้เวลา 1 - 60 นาที ทำการ'
    },
    {
        id: 2,
        title: 'Razer Gold PIN',
        category: 'CashCard',
        price: 500,
        maxDiscount: 0,
        image: 'https://seeklogo.com/images/R/razer-gold-logo-7663249110-seeklogo.com.png',
        description: 'บัตรเติมเงินสำหรับเกมเมอร์ ใช้ได้ทุกค่าย'
    },
    {
        id: 3,
        title: 'Genshin Impact',
        category: 'Game',
        price: 179,
        maxDiscount: 5,
        image: 'https://static.vecteezy.com/system/resources/previews/027/127/497/non_2x/genshin-impact-logo-genshin-impact-icon-transparent-free-png.png',
        description: 'แพ็คเกจ Blessing of the Welkin Moon'
    },
    {
        id: 4,
        title: 'Garena Shell',
        category: 'CashCard',
        price: 1000,
        maxDiscount: 2.5,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnRhlh__DJxuiz1NoM_rPUPz1O8G71MLAT7w&s',
        description: 'เติมเชลล์คุ้มๆ สำหรับ RoV, LoL, FC Online'
    },
    {
        id: 5,
        title: 'Steam Wallet',
        category: 'CashCard',
        price: 200,
        maxDiscount: 0,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png',
        description: 'โค้ดเติมเงิน Steam โซนไทย'
    },
    {
        id: 6,
        title: 'RoV',
        category: 'Game',
        price: 99,
        maxDiscount: 5,
        image: 'https://downloadr2.apkmirror.com/wp-content/uploads/2018/05/5b069dc19118a-384x384.png',
        description: 'แพ็คคูปองสุดคุ้ม เข้าทันทีไม่ต้องรอนาน'
    },
    {
        id: 7,
        title: 'Zenless Zone Zero',
        category: 'Game',
        price: 99,
        maxDiscount: 15,
        image: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Zenless_Zone_Zero_initialism_logo.svg/1902px-Zenless_Zone_Zero_initialism_logo.svg.png',
        description: 'แพ็คคูปองสุดคุ้ม เข้าทันทีไม่ต้องรอนาน'
    },
    {
        id: 8,
        title: 'Honkai: Star Rail',
        category: 'Game',
        price: 99,
        maxDiscount: 15,
        image: 'https://upload.wikimedia.org/wikipedia/pt/9/95/Honkai_Star_Rail_logo.png',
        description: 'แพ็คคูปองสุดคุ้ม เข้าทันทีไม่ต้องรอนาน'
    },
    {
        id: 9,
        title: 'League of Legends',
        category: 'Game',
        price: 99,
        maxDiscount: 15,
        image: 'https://wallpapers.com/images/featured/league-of-legends-icon-png-20luwm1ztdec7fkm.jpg',
        description: 'แพ็คคูปองสุดคุ้ม เข้าทันทีไม่ต้องรอนาน'
    },
    {
        id: 10,
        title: 'Free Fire',
        category: 'Game',
        price: 99,
        maxDiscount: 15,
        image: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Logo_of_Garena_Free_Fire.png',
        description: 'แพ็คคูปองสุดคุ้ม เข้าทันทีไม่ต้องรอนาน'
    },
    {
        id: 11,
        title: 'PUBG Mobile',
        category: 'Game',
        price: 99,
        maxDiscount: 5,
        image: 'https://www.freeiconspng.com/thumbs/pubg/pubg-circle-battlegrounds-photo-23.png',
        description: 'เติม UC ราคาคุ้มค่า'
    },
        {
        id: 12,
        title: 'Seven Knight Re:birth',
        category: 'Game',
        price: 99,
        maxDiscount: 13,
        image: 'https://sgimage.netmarble.com/mobile/game/tskgb/brand/v1/img/1139235b7378.png',
        description: 'ลดสูงสุด 13% เติมง่าย ได้ไว'
    },
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

    if (products.length === 0) return null

    const visibleProducts = isExpanded ? products : products.slice(0, LIMIT)
    const hasMore = products.length > LIMIT

    return (
        <Box sx={{ mb: 6 }}>
            {showTitle && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ width: 4, height: 24, bgcolor: '#111827', borderRadius: 1, mr: 1.5 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Kanit", sans-serif' }}>
                        {title}
                    </Typography>
                </Box>
            )}

            <Grid container spacing={3}>
                {visibleProducts.map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '24px',
                                border: '1px solid #F3F4F6',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                bgcolor: 'white',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
                                    borderColor: 'transparent',
                                    '& .product-img': { transform: 'scale(1.1)' }
                                }
                            }}
                            onClick={() => onProductClick(product.title)}
                        >
                            {/* --- 1. ป้ายหมวดหมู่ (ย้ายมา มุมซ้ายบน) --- */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 12,
                                    left: 12,
                                    zIndex: 10,
                                }}
                            >
                                <Chip
                                    label={product.category === 'Game' ? 'GAME' : 'CARD'}
                                    size="small"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.5px',
                                        bgcolor: 'rgba(255, 255, 255, 0.9)', // พื้นหลังขาวโปร่งแสงนิดๆ
                                        backdropFilter: 'blur(4px)',
                                        color: product.category === 'Game' ? '#7C3AED' : '#EA580C',
                                        border: '1px solid',
                                        borderColor: product.category === 'Game' ? '#E9D5FF' : '#FFEDD5',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}
                                />
                            </Box>

                            {/* --- ป้ายลดราคา (มุมขวาบน) --- */}
                            {product.maxDiscount > 0 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        zIndex: 10,
                                        background: 'linear-gradient(135deg, #FF4D4D 0%, #F9CB28 100%)',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderBottomLeftRadius: '20px',
                                        boxShadow: '-4px 4px 15px rgba(255, 77, 77, 0.4)',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}
                                >
                                    <LocalFireDepartmentRoundedIcon sx={{ fontSize: 18, color: '#FFF' }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                        -{product.maxDiscount}%
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ p: 4, pb: 2, display: 'flex', justifyContent: 'center', bgcolor: '#FAFAFA' }}>
                                <CardMedia
                                    component="img"
                                    className="product-img"
                                    image={product.image}
                                    alt={product.title}
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.15))',
                                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                />
                            </Box>

                            <CardContent sx={{ flexGrow: 1, textAlign: 'center', px: 3, pt: 3, pb: 4 }}>
                                {/* ลบ Chip อันเดิมออกจากตรงนี้ */}
                                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                                    {product.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    {product.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {hasMore && (
                <Box textAlign="center" mt={4}>
                    <Button 
                        variant="outlined" 
                        onClick={() => setIsExpanded(!isExpanded)}
                        endIcon={isExpanded ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
                        sx={{ 
                            borderRadius: '50px', 
                            textTransform: 'none',
                            px: 4,
                            py: 1,
                            borderColor: '#E5E7EB',
                            color: '#4B5563',
                            fontWeight: 600,
                            bgcolor: 'white',
                            '&:hover': { bgcolor: '#F9FAFB', borderColor: '#D1D5DB' }
                        }}
                    >
                        {isExpanded ? 'ย่อลง' : 'ดูเพิ่มเติม'}
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

    return (
        <Box
            sx={{
                background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f3f4f6 100%)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: '"Kanit", sans-serif'
            }}
        >
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, flex: 1 }}>

                {/* Header & Search */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            background: 'linear-gradient(45deg, #111827 30%, #4B5563 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-1px',
                            fontSize: { xs: '2.5rem', md: '3.5rem' }
                        }}
                    >
                        Deeshop Market
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 5, fontWeight: 400 }}>
                        แหล่งรวมเกมและบัตรเติมเงินที่คุ้มค่าที่สุด รวดเร็ว ปลอดภัย 100%
                    </Typography>

                    <Paper
                        elevation={0}
                        component="form"
                        sx={{
                            p: '4px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: 600,
                            mx: 'auto',
                            borderRadius: '50px',
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s',
                            '&:hover': {
                                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                                borderColor: '#D1D5DB'
                            }
                        }}
                    >
                        <IconButton sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon sx={{ color: '#9CA3AF' }} />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, fontFamily: 'inherit' }}
                            placeholder="ค้นหาชื่อเกม หรือ บัตรเติมเงิน..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Paper>
                </Box>

                {/* Category Filters */}
                <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 6 }}>
                    {['All', 'Game', 'CashCard'].map((cat) => {
                        const isSelected = selectedCategory === cat
                        return (
                            <Chip
                                key={cat}
                                label={cat === 'All' ? 'ทั้งหมด' : cat === 'Game' ? 'เกมออนไลน์' : 'บัตรเติมเงิน'}
                                clickable
                                onClick={() => setSelectedCategory(cat)}
                                icon={
                                    cat === 'All' ? <ShoppingCartIcon style={{ color: isSelected ? 'white' : 'inherit' }} /> :
                                        cat === 'Game' ? <SportsEsportsIcon style={{ color: isSelected ? 'white' : 'inherit' }} /> :
                                            <CreditCardIcon style={{ color: isSelected ? 'white' : 'inherit' }} />
                                }
                                sx={{
                                    bgcolor: isSelected ? '#111827' : 'white',
                                    color: isSelected ? 'white' : '#4B5563',
                                    border: '1px solid',
                                    borderColor: isSelected ? '#111827' : '#E5E7EB',
                                    borderRadius: '12px',
                                    px: 1,
                                    py: 2.5,
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: isSelected ? '#000' : '#F9FAFB',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            />
                        )
                    })}
                </Stack>

                <Divider sx={{ mb: 6, borderStyle: 'dashed', borderColor: '#E5E7EB' }} />

                {/* Content Sections */}
                {selectedCategory === 'All' ? (
                    <>
                        <ProductSection 
                            title="Game Online" 
                            products={games} 
                            onProductClick={handleProductClick} 
                            showTitle={true} 
                        />
                        <ProductSection 
                            title="Cash Card" 
                            products={cards} 
                            onProductClick={handleProductClick} 
                            showTitle={true} 
                        />
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
                    <Box textAlign="center" sx={{ mt: 8, py: 8, bgcolor: '#F9FAFB', borderRadius: 4, border: '1px dashed #E5E7EB' }}>
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

            {/* --- 2. ส่วนช่องทางติดต่อ (Footer Decoration) --- */}
            <Box sx={{ bgcolor: 'white', borderTop: '1px solid #E5E7EB', py: 4, mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Stack 
                        direction={{ xs: 'column', md: 'row' }} 
                        spacing={3} 
                        alignItems="center" 
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                                Contact Us
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                สอบถามปัญหา หรือติดตามข่าวสารโปรโมชั่น
                            </Typography>
                        </Box>
                        
                        <Stack direction="row" spacing={2}>
                            {/* Discord Button */}
                            <Button 
                                variant="contained" 
                                startIcon={<DiscordIcon />}
                                sx={{ 
                                    bgcolor: '#5865F2', 
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    borderRadius: '12px',
                                    '&:hover': { bgcolor: '#4752C4' }
                                }}
                            >
                                Discord
                            </Button>

                            {/* Facebook Button */}
                            <Button 
                                variant="contained" 
                                startIcon={<FacebookRoundedIcon />}
                                sx={{ 
                                    bgcolor: '#1877F2', 
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    borderRadius: '12px',
                                    '&:hover': { bgcolor: '#166FE5' }
                                }}
                                onClick={() => window.open('https://web.facebook.com/')}
                            >
                                Facebook
                            </Button>
                        </Stack>
                    </Stack>
                    
                    <Typography variant="caption" color="text.secondary" display="block" align="center" sx={{ mt: 4 }}>
                        © 2024 Deeshop Market. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    )
}

export default HomePage