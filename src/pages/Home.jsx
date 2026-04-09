import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
// find this line and replace it:
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Home = () => {
    // 1. Intha state add pannunga
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

// Mouse Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // stiffness: 150 (Faster reaction)
    // damping: 30 (Smooth but quick stop)
    const smoothX = useSpring(mouseX, { stiffness: 100, damping: 10});
    const smoothY = useSpring(mouseY, { stiffness: 100, damping: 10 });

    // Range-ah [60, -60] nu maathiruken, so image innum konjam dhooram move aagum (More visible fast motion)
    const imgX = useTransform(smoothX, [-0.5, 0.5], [70, -70]); 
    const imgY = useTransform(smoothY, [-0.5, 0.5], [70, -70]);

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        
        // precise calculation for faster response
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        // Resetting with a slight spring feel
        mouseX.set(0);
        mouseY.set(0);
    };
   
    
    const products = [
        { id: 1, name: "Premium Nitrogen NPK", price: 850, img: "https://p.globalsources.com/IMAGES/PDT/B1188566432/NPK-Compound-Fertilizer.jpg" },
        { id: 2, name: "Organic Bone Meal", price: 420, img: "https://5.imimg.com/data5/SELLER/Default/2022/9/RX/XN/YV/13233851/organic-bone-meal-fertilizer-500x500.jpg" },
        { id: 3, name: "Liquid Seaweed Extract", price: 990, img: "https://m.media-amazon.com/images/I/61S3y7T2SdL._AC_UF1000,1000_QL80_.jpg" },
        { id: 4, name: "Potash Power Mix", price: 550, img: "https://cpimg.tistatic.com/07545330/b/4/Potash-Fertilizer.jpg" }
    ];

    const categories = [
        { name: "Organic", icon: "fa-seedling", color: "#FFB347" },
        { name: "Chemical", icon: "fa-flask", color: "#77DD77" },
        { name: "Boosters", icon: "fa-leaf", color: "#FF6961" },
        { name: "Pesticides", icon: "fa-bug", color: "#84B6F4" }
    ];
    const slides = [
    {
        sub: "Natural & Organic",
        title: "-40% Offer All Fertilizers.",
        img: "/images/fertilizer1.png" 
    },
    {
        sub: "Farmer's Choice",
        title: "Best Bio Boosters Growth.",
        img: "/images/fertilizer2.png"
    },
    {
        sub: "Premium Quality",
        title: "Pure Potash Power Mix.",
        img: "/images/fertilizer3.png"
    }
];

    return (
        <div className="w-full min-h-screen bg-white">
            {/* Slider Section */}
            <section className="w-full h-[650px] slider-bg relative overflow-hidden slider-container">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 3000, disableOnInteraction: false }} // 3 Seconds Auto
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
                                {/* Text Content */}
                                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20">
                                    <motion.p 
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        className="harmic-sub uppercase text-sm font-bold"
                                    >
                                        {slide.sub}
                                    </motion.p>
                                    <motion.h2 
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="harmic-title font-bold"
                                    >
                                        {slide.title.split(' ').map((word, i) => (
                                            <span key={i} className="block">{word}</span>
                                        ))}
                                    </motion.h2>
                                    <motion.button 
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-[#79A206] text-white px-10 py-4 rounded-sm font-bold tracking-widest text-xs uppercase hover:bg-[#333] transition-all shadow-lg"
                                    >
                                        Shop Now
                                    </motion.button>
                                </div>

                                {/* Floating Image with Reverse Parallax and Saturn Shadow */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center items-center relative mt-10 md:mt-0">
                                    <motion.div 
                                        style={{ x: imgX, y: imgY }} 
                                        className="relative z-10 transition-all duration-100"
                                    >
                                        <img 
                                            src={slide.img} 
                                            alt="fertilizer" 
                                            className="h-[250px] md:h-[480px] object-contain" 
                                        />
                                    </motion.div>
                                    
                                    {/* The Saturn Shadow Effect */}
                                    <div className="saturn-shadow"></div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* 3. CATEGORIES - Responsive Grid */}
            <section className="w-full py-12 md:py-20 bg-white px-4 md:px-20 grid grid-cols-2 md:flex md:justify-around gap-8">
                {categories.map((cat, i) => (
                    <div key={i} className="flex flex-col items-center group cursor-pointer">
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all group-hover:-translate-y-2 shadow-sm border" style={{backgroundColor: cat.color + '15'}}>
                            <i className={`fa-solid ${cat.icon} text-2xl md:text-3xl`} style={{color: cat.color}}></i>
                        </div>
                        <span className="mt-4 font-bold text-gray-700 text-xs md:text-sm uppercase">{cat.name}</span>
                    </div>
                ))}
            </section>

            {/* 4. PRODUCTS */}
            <section className="w-full py-10 px-4 md:px-20 bg-gray-50/50">
                <div className="text-center mb-10">
                    <span className="text-[#79A206] font-bold text-xs tracking-widest uppercase">New Arrivals</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#333]">Top Fertilizers</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.map((p) => (
                        <div key={p.id} className="group bg-white rounded-xl overflow-hidden border hover:shadow-xl transition-all">
                            <div className="h-[250px] md:h-[320px] bg-[#f9f9f9] flex items-center justify-center relative overflow-hidden">
                                <img src={p.img} alt={p.name} className="h-3/4 object-contain group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-10 h-10 bg-white rounded-full shadow hover:bg-[#79A206] hover:text-white transition-all"><i className="fa fa-shopping-cart"></i></button>
                                    <button className="w-10 h-10 bg-white rounded-full shadow hover:bg-[#79A206] hover:text-white transition-all"><i className="fa fa-eye"></i></button>
                                </div>
                            </div>
                            <div className="p-4 md:p-6 text-center">
                                <h3 className="text-sm md:text-lg font-semibold text-[#333]">{p.name}</h3>
                                <p className="text-[#79A206] font-black text-xl mt-2">₹{p.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;