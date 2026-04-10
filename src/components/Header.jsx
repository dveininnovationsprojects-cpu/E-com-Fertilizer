import React, { useState, useEffect, useContext } from 'react'; // useContext add panniyachu
import { Link, useNavigate } from 'react-router-dom'; 
import API from '../api/axios';
import { CartContext } from '../context/CartContext'; // PUDHUSA ADD PANNATHU: CartContext

const Header = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false); 
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Temporary Auth State 
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const navigate = useNavigate();

    // PUDHUSA ADD PANNATHU: Cart details edukkurom
    const { cart } = useContext(CartContext);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        if (category === 'All Category') {
            navigate('/'); 
        } else {
            navigate(`/?category=${category}`); 
        }
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.length > 0) {
                try {
                    const response = await API.get(`/products?search=${searchTerm}`);
                    setSearchResults(response.data);
                } catch (error) {
                    console.error("Search error", error);
                }
            } else {
                setSearchResults([]);
            }
        };
        const delayDebounce = setTimeout(() => fetchSuggestions(), 300); 
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    return (
        <header className="w-full bg-white border-b sticky top-0 z-[100] shadow-sm px-4 md:px-16 py-3">
            <div className="flex items-center justify-between gap-2 md:gap-8">
                
                {/* 1. Logo Section */}
                <div className="flex items-center">
                    <button 
                        className="md:hidden mr-3 text-gray-700 text-xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
                    </button>
                    <Link to="/" className="flex items-center">
                        <img src="/images/logo.png" alt="Saraswathy" className="h-10 md:h-12 w-auto object-contain" />
                        <span className="hidden sm:block text-xl font-black ml-2 text-[#333] tracking-tighter">SARAL-X</span>
                    </Link>
                </div>

              <div className="hidden md:flex flex-1 max-w-2xl border-2 border-gray-100 rounded-md overflow-hidden bg-gray-50 h-11">
            <select 
                onChange={handleCategoryChange} 
                className="bg-transparent px-3 border-r text-xs font-bold outline-none text-gray-500 cursor-pointer"
            >
                <option>All Category</option>
                <option>Organic</option>
                <option>Chemical</option>
                <option>Tools</option>
                <option>Seeds</option>
            </select>
                   <input 
                type="text" 
                placeholder="Search Fertilizer..." 
                className="flex-1 px-4 outline-none text-sm bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-white px-5 text-gray-400">
                <i className="fa fa-search"></i>
            </button>
{/* --- Search Results Dropdown --- */}
{searchResults.length > 0 && (
    <div 
        className="absolute top-[100%] left-0 w-full bg-white shadow-2xl rounded-b-xl border border-t-0 border-gray-100 z-[110] overflow-hidden animate-fadeIn"
        style={{ 
            maxHeight: '375px',
            overflowY: 'auto' 
        }}
    >
        {searchResults.map((p) => (
            <div 
                key={p._id}
                onClick={() => {
                    navigate(`/product/${p._id}`);
                    setSearchTerm("");
                }}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[#79A206]/5 cursor-pointer border-b border-gray-50 last:border-0 transition-all group"
            >
                <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={p.imageUrl} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt={p.name} />
                </div>
                <div className="flex flex-col overflow-hidden text-left">
                    <span className="text-sm font-bold text-gray-800 truncate group-hover:text-[#79A206] transition-colors">{p.name}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#79A206]/10 text-[#79A206] px-2 py-0.5 rounded-full font-bold uppercase">{p.category}</span>
                        <span className="text-sm font-black text-gray-700">₹{p.price}</span>
                    </div>
                </div>
            </div>
        ))}
    </div>
)}
        </div>

                {/* 3. Navigation Icons Section */}
                <div className="flex items-center space-x-3 md:space-x-6 text-gray-700">
                    <div className="hidden md:flex items-center space-x-5 mr-4 border-r pr-6 border-gray-200">
                        <Link to="/" title="Home" className="hover:text-[#79A206] transition-all"><i className="fa-solid fa-house"></i></Link>
                        <Link to="/about" title="About Us" className="hover:text-[#79A206] transition-all"><i className="fa-solid fa-circle-info"></i></Link>
                        <Link to="/contact" title="Contact" className="hover:text-[#79A206] transition-all"><i className="fa-solid fa-phone-volume"></i></Link>
                    </div>
                    
                    {/* PUDHUSA ADD PANNATHU: Link tag and dynamic cartCount */}
                    <Link to="/cart" className="relative cursor-pointer hover:text-[#79A206] transition-all group">
                        <i className="fa-solid fa-cart-shopping text-xl"></i>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#79A206] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Account Dropdown */}
                    <div className="relative">
                        <div 
                            className="cursor-pointer hover:text-[#79A206] transition-all flex items-center gap-1"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <i className="fa-regular fa-user text-xl"></i>
                            <i className={`fa-solid fa-chevron-down text-[10px] mt-1 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}></i>
                        </div>
                        
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-4 w-48 bg-white shadow-2xl rounded-lg py-2 border border-gray-100 animate-fadeIn overflow-hidden">
                                {!isLoggedIn ? (
                                    <>
                                        <Link to="/login" className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors">
                                            <i className="fa-solid fa-right-to-bracket mr-3 text-[#79A206]"></i> Login
                                        </Link>
                                        <Link to="/register" className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors">
                                            <i className="fa-solid fa-user-plus mr-3 text-[#79A206]"></i> Register
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/profile" className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors">
                                            <i className="fa-solid fa-id-badge mr-3 text-[#79A206]"></i> My Profile
                                        </Link>
                                        <button className="w-full flex items-center px-4 py-3 hover:bg-red-50 text-sm font-semibold text-red-600 transition-colors border-t">
                                            <i className="fa-solid fa-power-off mr-3"></i> Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[110] flex">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="relative w-[80%] max-w-[300px] bg-white h-full shadow-2xl animate-fadeInRight py-6 px-4">
                        <div className="flex items-center justify-between mb-8 border-b pb-4">
                            <img src="/images/logo.png" alt="logo" className="h-8" />
                            <i className="fa-solid fa-xmark text-xl text-gray-400" onClick={() => setIsMenuOpen(false)}></i>
                        </div>
                        
                        <ul className="flex flex-col space-y-5 font-bold text-gray-700">
                            <li><Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><i className="fa-solid fa-house text-[#79A206]"></i> Home</Link></li>
                            <li><Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><i className="fa-solid fa-circle-info text-[#79A206]"></i> About Us</Link></li>
                            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3"><i className="fa-solid fa-phone text-[#79A206]"></i> Contact</Link></li>
                            
                            {/* Mobile Account Sub-menu */}
                            <li className="border-t pt-4">
                                <div 
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                                >
                                    <div className="flex items-center gap-3"><i className="fa-solid fa-user-gear text-[#79A206]"></i> My Account</div>
                                    <i className={`fa-solid fa-angle-down text-xs transition-transform ${isAccountOpen ? 'rotate-180' : ''}`}></i>
                                </div>
                                {isAccountOpen && (
                                    <ul className="pl-8 mt-4 space-y-4 text-sm font-semibold text-gray-500">
                                        {!isLoggedIn ? (
                                            <>
                                                <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
                                                <li><Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link></li>
                                            </>
                                        ) : (
                                            <>
                                                <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
                                                <li className="text-red-500">Logout</li>
                                            </>
                                        )}
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;