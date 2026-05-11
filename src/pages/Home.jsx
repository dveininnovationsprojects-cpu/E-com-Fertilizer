import React, { useState, useEffect, useRef, useContext } from 'react';
// find this line and add useLocation
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import API from '../api/axios';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Home = () => {
    const navigate = useNavigate();
    
    const productSectionRef = useRef(null); // For "Shop Now" scroll logic
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const categoryFromURL = queryParams.get('category') || 'All';
const searchFromURL = queryParams.get('search') || ""; // Add search param
const { addToCart } = useContext(CartContext);

useEffect(() => {
    const fetchProducts = async () => {
        setLoading(true);
        try {
            // 1. URL params ready pannurom
            const params = {};
            if (categoryFromURL && categoryFromURL !== 'All') {
                params.category = categoryFromURL;
            }
            if (searchFromURL) {
                params.search = searchFromURL;
            }

            // 2. ORE ORU API CALL (Clean-ah axiosConfig use pannurom)
            // Backend-ku query params anuppurom
            const response = await API.get('/products', { params });

            // 3. Data-va set pannurom
            setProducts(response.data);
            setLoading(false);

            // 🟢 Page Scroll Logic
            if (location.search) { 
                setTimeout(() => {
                    productSectionRef.current?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 100);
            }
        } catch (error) {
            console.error("Error fetching products:", error.message);
            setLoading(false);
        }
    };

    fetchProducts();
}, [categoryFromURL, searchFromURL, location.search]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 100, damping: 10 });
    const smoothY = useSpring(mouseY, { stiffness: 100, damping: 10 });
    const imgX = useTransform(smoothX, [-0.5, 0.5], [70, -70]); 
    const imgY = useTransform(smoothY, [-0.5, 0.5], [70, -70]);

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX - left) / width - 0.5);
        mouseY.set((clientY - top) / height - 0.5);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const categories = [
    { name: "Humic Acid", icon: "fa-flask-vial", color: "#9b59b6" },
    { name: "Seaweed", icon: "fa-water", color: "#1abc9c" },
    { name: "Potassium Humate", icon: "fa-atom", color: "#34495e" },
    { name: "Neem Oil", icon: "fa-droplet", color: "#27ae60" },
    { name: "Organic Granules", icon: "fa-cubes", color: "#d35400" },
    { name: "Fish Oil", icon: "fa-fish", color: "#2980b9" }
];

    const slides = [
    { 
        sub: "Natural & Organic", 
        titleLines: ["Humic Power", "Live Soil", "Strong Roots."], 
        img: "/images/fertilizer1.png" 
    },
    { 
        sub: "Farmer's Choice", 
        titleLines: ["Bio stimulants", "For Faster", "Crop Growth."], 
        img: "/images/fertilizer2.png" 
    },
    { 
        sub: "Premium Quality", 
        titleLines: ["Healthy Crops", "For Better", "Harvest."], 
        img: "/images/fertilizer3.png" 
    }
];

    
    const scrollToProducts = () => {
        productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    

    return (
        <div className="w-full min-h-screen bg-white overflow-x-hidden">
            
            {/* --- HERO SLIDER --- */}
            <section className="w-full h-[650px] slider-bg relative overflow-hidden slider-container">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                    navigation={true}
                    pagination={{ clickable: true }}
                    className="h-full w-full"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div 
                                className="flex flex-col md:flex-row items-center h-full px-10 md:px-32 py-10 md:py-0"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20">
    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="harmic-sub uppercase text-sm font-bold">
        {slide.sub}
    </motion.p>
    
    <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="harmic-title font-bold">
        {/* FIX: line-by-line mapping */}
        {slide.titleLines.map((line, i) => (
            <span key={i} className="block leading-tight">{line}</span>
        ))}
    </motion.h2>

    <button 
        onClick={scrollToProducts}
        className="bg-[#79A206] text-white px-10 py-4 rounded-sm font-bold tracking-widest text-xs uppercase hover:bg-[#333] transition-all shadow-lg mt-6"
    >
        Shop Now
    </button>
</div>

                                <div className="w-full md:w-1/2 flex flex-col justify-center items-center relative mt-10 md:mt-0">
                                    <motion.div style={{ x: imgX, y: imgY }} className="relative z-10 transition-all duration-100">
                                        <img src={slide.img} alt="fertilizer" className="h-[250px] md:h-[480px] object-contain bag-shadow" />
                                    </motion.div>
                                    <div className="saturn-shadow"></div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* --- CATEGORIES SECTION --- */}
<section className="w-full py-16 bg-white px-6 md:px-20">
    <div className="text-center mb-12">
        <span className="text-[#79A206] font-bold text-xs tracking-[4px] uppercase mb-2 block">Quick Filter</span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#333]">Browse By Category</h2>
        <div className="w-20 h-1 bg-[#79A206] mx-auto mt-4 rounded-full"></div>
    </div>

  {/* CATEGORIES SECTION UI */}
<div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-6xl mx-auto">
    {/* ALL ITEMS ICON */}
    <div className="flex flex-col items-center group cursor-pointer" onClick={() => { navigate('/'); setTimeout(() => scrollToProducts(), 100); }}>
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 shadow-sm border 
            ${categoryFromURL === 'All' ? 'border-[#79A206] bg-[#79A206]/10' : 'border-gray-100 bg-gray-50'}`}>
            <i className="fa-solid fa-border-all text-xl md:text-2xl text-[#79A206]"></i>
        </div>
        <span className={`mt-3 font-bold text-[10px] md:text-xs uppercase tracking-wider text-center ${categoryFromURL === 'All' ? 'text-[#79A206]' : 'text-gray-500'}`}>All Items</span>
    </div>

    {categories.map((cat, i) => (
        <div key={i} className="flex flex-col items-center group cursor-pointer w-20 md:w-24" 
             onClick={() => navigate(`/?category=${cat.name}`)}>
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 shadow-sm border 
                ${categoryFromURL === cat.name ? 'border-[#79A206] bg-[#79A206]/10 shadow-md' : 'border-gray-100'}`} 
                 style={{ backgroundColor: categoryFromURL === cat.name ? '' : cat.color + '15' }}>
                
                <i className={`fa-solid ${cat.icon} text-xl md:text-2xl transition-colors`} 
                   style={{ color: categoryFromURL === cat.name ? '#79A206' : cat.color }}></i>
            </div>
            <span className={`mt-3 font-bold text-[10px] md:text-xs uppercase tracking-wider text-center line-clamp-1 ${categoryFromURL === cat.name ? 'text-[#79A206]' : 'text-gray-500'}`}>
                {cat.name}
            </span>
        </div>
    ))}
</div>
</section>

            {/* --- PRODUCTS GRID (DYNAMIC FROM BACKEND) --- */}
            <section ref={productSectionRef} className="w-full py-10 px-4 md:px-20 bg-gray-50/50 min-h-[600px]">
                <div className="text-center mb-16">
                    <span className="text-[#79A206] font-bold text-xs tracking-widest uppercase mb-2 block">Our Collection</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#333]">Featured Fertilizers</h2>
                    <div className="w-24 h-1 bg-[#79A206] mx-auto mt-4 rounded-full"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-[#79A206]"></i>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {products.map((p) => (
                            <div 
                                key={p._id} 
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                onClick={() => navigate(`/product/${p._id}`)}
                            >
                                <div className="h-[320px] bg-[#f9f9f9] relative flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={p.imageUrl} 
                                        alt={p.name} 
                                        className="h-3/4 w-3/4 object-contain group-hover:scale-110 transition-transform duration-700" 
                                    />
                                    
                                    {/* Action Buttons Overlay */}
{/* Action Buttons Overlay */}
<div className="absolute bottom-[-60px] group-hover:bottom-6 left-0 right-0 flex justify-center space-x-3 transition-all duration-500">
    
    {/* CART BUTTON - Add and Navigate */}
    <button 
        onClick={(e) => {
            e.stopPropagation(); // Card click details page poguratha thadukkum
            addToCart(p); // Context update panni cart-la add pannum
            navigate('/cart'); // Instant-ah cart page kootitu pogum
        }}
        className="w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#79A206] hover:text-white transition-all"
    >
        <i className="fa-solid fa-cart-plus"></i>
    </button>

    {/* EYE BUTTON - View Details Only */}
    <button 
        onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${p._id}`);
        }}
        className="w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#79A206] hover:text-white transition-all"
    >
        <i className="fa-regular fa-eye"></i>
    </button>
</div>

                                    
                                </div>

                                <div className="p-6 text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{p.category}</p>
                                    <h3 className="text-lg font-semibold text-[#333] group-hover:text-[#79A206] transition-colors line-clamp-1">{p.name}</h3>
                                   <div className="mt-2 flex flex-col items-center">
    <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest line-through mb-1">
        MRP: ₹{p.mrp}.00
    </span>
    <span className="text-[#79A206] font-black text-2xl">
        Offer: ₹{p.price}.00
    </span>
</div>
                                    
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="text-center text-gray-500 py-20">
                        <i className="fa-solid fa-boxes-open text-6xl mb-4 block opacity-20"></i>
                        No products available in store right now.
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;