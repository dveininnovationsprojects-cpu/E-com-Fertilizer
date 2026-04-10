import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#F3F4ED] pt-20">
            <div className="max-w-7xl mx-auto px-10 pb-20 grid grid-cols-1 md:grid-cols-3 gap-16">
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-[#333]">SARAL-X</h2>
                    <p className="text-gray-500 leading-relaxed text-sm">Empowering farmers with high-quality nutrients for a more productive and organic harvest. Your success is our mission.</p>
                    <div className="flex space-x-5">
                        <div className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-[#79A206] hover:border-[#79A206] hover:text-white transition-all cursor-pointer"><i className="fa-brands fa-facebook-f"></i></div>
                        <div className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-[#79A206] hover:border-[#79A206] hover:text-white transition-all cursor-pointer"><i className="fa-brands fa-instagram"></i></div>
                        <div className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-[#79A206] hover:border-[#79A206] hover:text-white transition-all cursor-pointer"><i className="fa-brands fa-whatsapp"></i></div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h4 className="font-bold text-xl text-[#333]">Quick Contact</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li className="flex items-center"><i className="fa fa-location-dot mr-4 text-[#79A206] text-lg"></i> Main Bazar, Coimbatore, TN</li>
                        <li className="flex items-center"><i className="fa fa-phone mr-4 text-[#79A206] text-lg"></i> +91 98421 00000</li>
                        <li className="flex items-center"><i className="fa fa-envelope mr-4 text-[#79A206] text-lg"></i> help@saraswathy.com</li>
                    </ul>
                </div>
               <div className="flex flex-col justify-center items-center md:items-end">
    {/* 1. Added a container for the circle shape */}
    <div className="flex flex-col justify-center items-center md:items-end">
    <div className="w-24 h-24 rounded-full border-4 border-[#79A206] shadow-xl flex items-center justify-center overflow-hidden bg-white group cursor-pointer transition-all hover:scale-110">
        <img 
            src="/images/logo.png" 
            alt="Saraswathy" 
            className="h-full w-full object-fill" 
        />
    </div>
</div>
</div>
            </div>
            <div className="w-full bg-[#79A206] py-5 text-center text-white text-[10px] font-bold tracking-[3px] uppercase">
                © 2026 Saraswathy Traders | Purely Organic
            </div>
        </footer>
    );
};

export default Footer;