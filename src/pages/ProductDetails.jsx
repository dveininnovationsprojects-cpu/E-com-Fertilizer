import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from "../api/axios";
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext'; // PUDHUSA ADD PANNATHU: Namma CartContext
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await API.get(`/products/${id}`);
                setProduct(response.data);
                setMainImage(response.data.imageUrl);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product details:", error);
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="h-screen flex justify-center items-center">
            <i className="fa-solid fa-circle-notch fa-spin text-5xl text-[#79A206]"></i>
        </div>
    );  

    if (!product) return <div className="text-center py-20 font-bold text-xl">Product Not Found!</div>;
const addToCartHandler = async (shouldNavigate = false) => {
    // Ippo backend call-a comment pannidunga (Temporary)
    /*
    try {
        await API.post('/cart/add', {
            productId: product._id,
            quantity: quantity
        });
    } catch (error) { ... }
    */

    // Direct-ah frontend context-la mattum add pannunga
    addToCart({ ...product, quantity }); 
    toast.success("Added to Cart Successfully!");

    if (shouldNavigate) {
        navigate('/cart');
    }
};

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-20 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                <div className="space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-[400px] md:h-[600px] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center p-6 shadow-sm"
                    >
                        <img 
                            src={mainImage} 
                            alt={product.name} 
                            className="h-full object-contain hover:scale-110 transition-transform duration-500" 
                        />
                    </motion.div>
                    
                   {/* Thumbnail List - Duplicate fix panniyachi */}
<div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
    {/* product.images array-va mattum map pannunga */}
    {product.images.map((img, index) => (
        <div 
            key={index}
            onClick={() => setMainImage(img)}
            className={`w-20 h-20 md:w-24 md:h-24 min-w-max rounded-xl border-2 cursor-pointer overflow-hidden transition-all
                ${mainImage === img ? 'border-[#79A206] shadow-md' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
        >
            <img src={img} alt={`thumb-${index}`} className="w-full h-full object-contain bg-white" />
        </div>
    ))}
</div>
                </div>

                <div className="flex flex-col space-y-6">
                    <div>
                        <span className="bg-[#79A206]/10 text-[#79A206] px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                            {product.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#333] mt-4 leading-tight">
                            {product.name}
                        </h1>
                        
                    </div>

                    <div className="border-y border-gray-100 py-6">
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-[#79A206]">₹{product.price}.00</span>
                            
                        </div>
                        <p className="text-gray-500 mt-4 leading-relaxed text-lg">
                            {product.description}
                        </p>
                    </div>

                    {/* Stock & Quantity */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-10">
                            <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 w-max shadow-sm">
                                <button 
                                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:text-[#79A206] transition-colors"
                                >
                                    <i className="fa-solid fa-minus text-xs"></i>
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:text-[#79A206] transition-colors"
                                >
                                    <i className="fa-solid fa-plus text-xs"></i>
                                </button>
                            </div>
                            
                            <span className={`font-bold text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                <i className={`fa-solid ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'} mr-2`}></i>
                                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
    {/* Add to Cart - No alert, no popup, silent add */}
    <button 
        onClick={() => addToCartHandler(false)}
        className="flex-1 bg-[#79A206] text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-[#333] transition-all shadow-xl shadow-[#79A206]/20"
    >
        <i className="fa-solid fa-cart-shopping mr-3"></i> Add to Cart
    </button>

    {/* Buy Now - Add to cart and then Navigate to Cart page */}
    <button 
        onClick={() => addToCartHandler(true)}
        className="flex-1 bg-[#333] text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all"
    >
        Buy Now
    </button>
</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;