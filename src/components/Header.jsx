import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = () => {
            const stored = localStorage.getItem('user');
            setUser(stored ? JSON.parse(stored) : null);
        };
        loadUser();
        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    return (
        <header className="w-full bg-white border-b sticky top-0 z-[100] shadow-sm px-4 md:px-16 py-4">
            <div className="flex items-center justify-between gap-4">
                
                {/* Logo Section */}
                <div className="flex items-center">
                    {/* Mobile Menu Toggle Button */}
                    <button 
                        className="md:hidden mr-4 text-gray-700 text-xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
                    </button>
                    <Link to="/" className="flex items-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/3043/3043229.png" alt="logo" className="h-8 md:h-10 w-8 md:w-10" />
                        <span className="text-xl md:text-2xl font-bold ml-2 text-[#333]">SARASWATHY</span>
                    </Link>
                </div>

                {/* Search Bar - Hidden on small mobile, shown on Tablet/Desktop */}
                <div className="hidden sm:flex flex-1 max-w-2xl border-2 border-gray-100 rounded-md overflow-hidden bg-gray-50">
                    <select className="hidden lg:block bg-transparent px-3 border-r text-xs font-medium outline-none text-gray-500">
                        <option>All Category</option>
                        <option>Organic</option>
                        <option>Chemical</option>
                    </select>
                    <input type="text" placeholder="Search Fertilizer..." className="flex-1 px-4 py-2 outline-none text-sm bg-white" />
                    <button className="bg-white px-4 text-gray-400 hover:text-[#79A206] transition-colors">
                        <i className="fa fa-search"></i>
                    </button>
                </div>

                {/* Icons Section */}
                <div className="flex items-center space-x-4 md:space-x-8 text-gray-700">
                    <Link to="/about" className="hidden md:block hover:text-[#79A206] font-medium text-sm">About</Link>
                    
                    <div className="relative cursor-pointer hover:text-[#79A206]">
                        <i className="fa-solid fa-cart-shopping text-lg md:text-xl"></i>
                        <span className="absolute -top-2 -right-2 bg-[#79A206] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">0</span>
                    </div>

                    <div className="relative flex items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
                        {user && <span className="hidden md:block text-sm font-medium text-[#3a5000]">{user.name}</span>}
                        <i className="fa-regular fa-user text-lg md:text-xl hover:text-[#79A206]"></i>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Navigation */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg animate-fadeIn">
                    <ul className="flex flex-col p-4 space-y-4 font-medium text-gray-600">
                        <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
                        <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>All Fertilizers</Link></li>
                        <li className="pt-2 border-t text-xs text-gray-400 uppercase tracking-widest">Categories</li>
                        <li className="pl-2">Organic Fertilizer</li>
                        <li className="pl-2">Chemical Fertilizer</li>
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;