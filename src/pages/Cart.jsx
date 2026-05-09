import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import API from "../api/axios"; 
import toast, { Toaster } from "react-hot-toast";

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [paymentFile, setPaymentFile] = useState(null);
    // Component States
    const [showPayment, setShowPayment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    
    
    const [adminInfo, setAdminInfo] = useState({
        upiId: "",
        qrCode: "" 
    });

    // Calculate the total order amount
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Fetch Admin Settings on component mount
    useEffect(() => {
        const fetchAdminSettings = async () => {
            try {
                const response = await API.get('/admin/settings'); 
                if (response.data) {
                    setAdminInfo({
                        upiId: response.data.upiId || "",
                        qrCode: response.data.qrCode || ""
                    });
                }
            } catch (error) {
                console.error("Failed to fetch admin settings:", error);
            }
        };

        fetchAdminSettings();
    }, []);
    const handleProceedToPayment = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
        toast.error("Please login to proceed with the payment!", {
            icon: '⚠️',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        return; 
    }

   
    setShowPayment(true);
};
    

const handleConfirmAndWhatsApp = async () => {
    // 1. First Check: User Login aagi irukkangala?
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!storedUser) {
        toast.error("Please login before placing an order!", {
            icon: '⚠️',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        return; // Login illana ithoda function stop aydum
    }

   if (!paymentFile) {
    toast.error("Please upload payment screenshot!");
    return;
}

    // Ellam iruntha mattum Loading start pannanum
    setLoading(true);

    try {
        const userAddress = storedUser?.address || storedUser?.user?.address || "Address not provided";

        const formData = new FormData();
        formData.append('orderItems', JSON.stringify(cart.map(item => ({ 
            product: item._id, 
            quantity: item.quantity, 
            price: item.price 
        }))));
        formData.append('totalAmount', totalAmount);
        formData.append('shippingAddress', userAddress);
        formData.append('paymentScreenshot', paymentFile); 

        // 1. Create Order (POST request)
        const res = await API.post('/orders', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        const orderId = res.data._id;
        const screenshotUrl = res.data.paymentScreenshot;

        // 2. WhatsApp Message Link Generation
        const adminNumber = "9944848617";
        const message = `*NEW ORDER PLACED!* \n\n*Order ID:* ${orderId}\n*Total:* ₹${totalAmount}\n*Address:* ${userAddress}\n\n*Payment Proof:* ${screenshotUrl}`;
        
        const whatsappLink = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
        
        // WhatsApp tab open pannanum
        window.open(whatsappLink, '_blank');

        // 3. Final Steps: Cart clear panni Success Modal kaattanum
        clearCart();
        setShowSuccessPopup(true);

    } catch (error) {
    console.error(error);
    
    toast.error("Order failed! Please try again."); 
} finally {
        setLoading(false);
    }
};

// Empty Cart UI State
    if (cart.length === 0) {
        return (
            <>
                {/* SUCCESS POPUP MODAL (Inga kondu vanthutom) */}
                {showSuccessPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
                        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-fadeIn">
                            {/* Success Icon */}
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-green-500">
                                <i className="fa-solid fa-check text-4xl"></i>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
                            <p className="text-gray-500 mb-8 text-sm">
                                Your order has been successfully placed. We've redirected you to WhatsApp to send the payment screenshot.
                            </p>
                            
                            {/* Check Order Button */}
                            <button 
                                onClick={() => navigate('/profile', { state: { activeTab: 'orders' } })}
                                className="w-full bg-[#79A206] hover:bg-[#658a05] text-white py-3 rounded-xl font-bold transition-all shadow-md"
                            >
                                Check Order History
                            </button>
                        </div>
                    </div>
                )}

                {/* NORMAL EMPTY CART DESIGN */}
                <div className="flex flex-col items-center justify-center py-24 px-4 bg-gray-50 min-h-[60vh]">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                        <i className="fa-solid fa-cart-shopping text-4xl text-gray-300"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-[#333] mb-2 text-center">Your cart is currently empty</h2>
                    <p className="text-gray-500 mb-8 text-center max-w-md">Before proceeding to checkout, you must add some products to your shopping cart.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-[#79A206] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#658a05] transition-colors shadow-md"
                    >
                        Return to Shop
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <Toaster position="top-center" />
            <h1 className="text-3xl font-bold mb-8">Checkout Process</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* LEFT SIDE: Order Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-4 mb-6 border-b pb-6">
                        {cart.map((item) => (
                            <div key={item._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <img src={item.imageUrl || item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                                    <div>
                                        <h3 className="font-bold text-md text-gray-800">{item.name}</h3>
                                        <div className="font-bold text-[#1f6b5b] text-sm mb-2">₹{item.price} / item</div>
                                        
                                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 py-1 w-fit shadow-sm">
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded text-gray-600 hover:bg-gray-200 transition-colors"
                                            >
                                                <i className="fa-solid fa-minus text-xs"></i>
                                            </button>
                                            
                                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                            
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded text-gray-600 hover:bg-gray-200 transition-colors"
                                            >
                                                <i className="fa-solid fa-plus text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-3">
                                    <button 
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="Remove from Cart"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                    <div className="font-black text-lg">₹{item.price * item.quantity}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-[#79A206]">₹{totalAmount}</span>
                    </div>
                    
                    {!showPayment && (
                        <button 
    onClick={handleProceedToPayment} // Namma puthu function inga varum
    className="mt-6 bg-[#79A206] text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-[#658a05] transition-colors"
>
    Proceed to Payment
</button>
                    )}
                </div>

                {/* RIGHT SIDE: Payment Gateway Interface */}
                {showPayment && (
                    <div className="bg-[#fcfaf7] rounded-3xl shadow-lg border border-gray-200 p-6 animate-fadeInRight">
                        <div className="flex items-center gap-4 mb-6 border-b pb-4">
                            <button onClick={() => setShowPayment(false)} className="hover:text-[#1f6b5b] transition-colors">
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <h2 className="text-lg font-bold">Payment Transaction</h2>
                        </div>

                        {/* Dynamic Bank QR Code Section */}
                        <div className="bg-white p-6 rounded-xl border mb-6 flex flex-col items-center text-center shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-2">Scan & Pay via any UPI App</h3>
                            
                            {adminInfo.qrCode ? (
                                <img 
                                    src={adminInfo.qrCode} 
                                    alt="Official Bank QR Code" 
                                    className="w-56 h-auto rounded-lg mb-4 object-contain"
                                />
                            ) : (
                                <div className="w-56 h-56 bg-gray-100 flex items-center justify-center rounded-lg mb-4 border border-dashed border-gray-300">
                                    <span className="text-sm text-gray-400">Loading QR Code...</span>
                                </div>
                            )}

                            <div className="text-sm text-gray-500">
                                UPI ID: <span className="font-bold text-black block mt-1">{adminInfo.upiId || "Loading UPI ID..."}</span>
                            </div>
                        </div>

                        {/* Total Amount Display */}
                        <div className="mb-6 flex justify-between items-center bg-[#eef5f4] p-4 rounded-xl border border-[#d1e6e2]">
                            <label className="text-sm text-[#1f6b5b] font-bold">Amount to Pay</label>
                            <div className="text-3xl font-black text-[#1f6b5b]">₹{totalAmount}</div>
                        </div>
<div className="bg-[#eef5f4] border border-[#25D366] p-6 rounded-xl text-center mb-6 shadow-sm">
    <i className="fa-brands fa-whatsapp text-4xl text-[#25D366] mb-3 block"></i>
    <h3 className="font-bold text-[#1f6b5b]">Send Payment Proof</h3>
    <p className="text-sm text-gray-500 mt-2 mb-4">
        Upload your payment screenshot below and confirm your order.
    </p>

    {/* 🟢 File Input Start */}
    <div className="mb-4">
        <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setPaymentFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#25D366] file:text-white
                hover:file:bg-[#1ebd5b]
                cursor-pointer"
        />
        {paymentFile && (
            <p className="text-xs text-[#1f6b5b] mt-2 font-bold">
                ✓ {paymentFile.name} selected
            </p>
        )}
    </div>
    {/* 🟢 File Input End */}
    
    <button 
        onClick={handleConfirmAndWhatsApp}
        disabled={loading || !paymentFile} 
        className={`w-full text-white py-4 rounded-xl font-bold uppercase tracking-wide flex items-center justify-center gap-3 transition-all ${
            (loading || !paymentFile) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#1ebd5b] hover:shadow-lg'
        }`}
    >
        <i className="fa-brands fa-whatsapp text-xl"></i>
        {loading ? 'Processing...' : 'Confirm Order'}
    </button>
</div>                             
                        </div>
                    
                )}
                
            </div>
        </div>
    );
};

export default Cart;