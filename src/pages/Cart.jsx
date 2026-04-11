import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import API from "../api/axios"; 

const Cart = () => {
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    
    // Component States
    const [showPayment, setShowPayment] = useState(false);
    const [screenshot, setScreenshot] = useState(null);
    const [loading, setLoading] = useState(false);

    // Calculate the total order amount
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Convert the uploaded image to a Base64 string for easier backend transmission
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setScreenshot(reader.result);
            };
        }
    };

    // Handle the final order submission
    const handleConfirmAndPay = async () => {
        if (!screenshot) {
            alert("Please upload the payment screenshot to complete your order.");
            return;
        }

        setLoading(true);
        try {
            // Prepare the payload for the API
            const orderData = {
                orderItems: cart.map(item => ({ product: item._id, quantity: item.quantity, price: item.price })),
                totalAmount: totalAmount,
                shippingAddress: "User Address", // To be updated with dynamic user address later
                paymentScreenshot: screenshot 
            };

            // Post order details to the backend
            const res = await API.post('/orders', orderData);
            alert("Order Placed Successfully! Your order will be confirmed once the administration verifies the payment.");
            
            // Redirect user back to home page after successful order
            navigate('/');
        } catch (error) {
            console.error("Order submission failed:", error);
            alert("An error occurred while placing the order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Empty Cart UI State
    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-gray-50 min-h-[60vh]">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                    <i className="fa-solid fa-cart-shopping text-4xl text-gray-300"></i>
                </div>
                <h2 className="text-2xl font-bold text-[#333] mb-2 text-center">Your cart is currently empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">Before proceeding to checkout, you must add some products to your shopping cart.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-[#1f6b5b] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#154d41] transition-colors shadow-md"
                >
                    Return to Shop
                </button>
            </div>
        );
    }

    // Main Cart & Checkout UI
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Checkout Process</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* LEFT SIDE: Order Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-4 mb-6 border-b pb-6">
                        {cart.map((item) => (
                            <div key={item._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <img src={item.imageUrl || item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                    <div>
                                        <h3 className="font-bold text-md">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="font-bold">₹{item.price * item.quantity}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-[#79A206]">₹{totalAmount}</span>
                    </div>
                    
                    {!showPayment && (
                        <button 
                            onClick={() => setShowPayment(true)}
                            className="mt-6 bg-[#1f6b5b] text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-[#154d41] transition-colors"
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

                        {/* Static Bank QR Code Section */}
                        <div className="bg-white p-6 rounded-xl border mb-6 flex flex-col items-center text-center shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-2">Scan & Pay via any UPI App</h3>
                            
                            <img 
                                src="/images/my-qr-code.jpg" 
                                alt="Official Bank QR Code" 
                                className="w-56 h-auto rounded-lg mb-4"
                            />

                            <div className="text-sm text-gray-500">
                                UPI ID: <span className="font-bold text-black block mt-1">selvamanisellan.18@oksbi</span>
                            </div>
                        </div>

                        {/* Total Amount Display */}
                        <div className="mb-6 flex justify-between items-center bg-[#eef5f4] p-4 rounded-xl border border-[#d1e6e2]">
                            <label className="text-sm text-[#1f6b5b] font-bold">Amount to Pay</label>
                            <div className="text-3xl font-black text-[#1f6b5b]">₹{totalAmount}</div>
                        </div>

                        {/* Screenshot Upload Interface */}
                        <div className="bg-[#eef5f4] border border-[#d1e6e2] border-dashed p-6 rounded-xl text-center mb-6 relative hover:bg-[#dcefe1] transition-colors">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {screenshot ? (
                                <div className="text-green-600 font-bold flex flex-col items-center">
                                    <i className="fa-solid fa-check-circle text-3xl mb-2 text-[#1f6b5b]"></i>
                                    Payment Verified Successfully!
                                </div>
                            ) : (
                                <div>
                                    <i className="fa-solid fa-camera text-3xl text-[#1f6b5b] mb-3 block"></i>
                                    <h3 className="font-bold text-[#1f6b5b]">Upload Payment Proof</h3>
                                    <p className="text-xs text-gray-500 mt-2">Please upload a screenshot of your successful transaction to proceed.</p>
                                </div>
                            )}
                        </div>

                        {/* Submission Action */}
                        <button 
                            onClick={handleConfirmAndPay}
                            disabled={loading || !screenshot}
                            className={`w-full text-white py-4 rounded-xl font-bold uppercase tracking-wide transition-all ${loading || !screenshot ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1f6b5b] hover:bg-[#154d41] hover:shadow-lg'}`}
                        >
                            {loading ? 'Processing Order...' : 'Confirm and Submit Order'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;