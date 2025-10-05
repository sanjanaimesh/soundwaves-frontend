import { Link } from "react-router-dom";
import { useState } from "react";
import { RiFileChart2Fill } from "react-icons/ri";
import { FaCartShopping } from "react-icons/fa6";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full h-[80px] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-2xl flex justify-between items-center px-6 lg:px-12 relative top-0 z-50 border-b border-slate-800/50 backdrop-blur-sm">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group z-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                    <img 
                        src="/logo.jpg" 
                        alt="logo" 
                        className="relative h-[60px] w-[60px] object-cover rounded-full ring-2 ring-cyan-500/50 group-hover:ring-cyan-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-cyan-500/20" 
                    />
                </div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 hidden lg:block group-hover:tracking-wider transition-all duration-300">
                    Your Brand
                </span>
            </Link>
            
            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex gap-1 absolute left-1/2 transform -translate-x-1/2">
                <Link to="/" className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group px-6 py-2.5 rounded-lg overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                        Home
                    </span>
                </Link>
                <Link to="/contact" className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group px-6 py-2.5 rounded-lg overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                        Contact
                    </span>
                </Link>
                <Link to="/gallery" className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group px-6 py-2.5 rounded-lg overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                        Gallery
                    </span>
                </Link>
                <Link to="/items" className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group px-6 py-2.5 rounded-lg overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                        Items
                    </span>
                </Link>

                {/* Cart link */}
                <Link to="/booking" className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group px-6 py-2.5 rounded-lg overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                        <FaCartShopping className="w-4 h-4" />
                        
                    </span>
                </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-300 hover:text-cyan-400 transition-colors duration-300 p-2 rounded-lg hover:bg-cyan-500/10 relative group z-10"
                aria-label="Toggle menu"
            >
                <div className="relative w-7 h-7 flex flex-col justify-center items-center">
                    <span className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45' : '-translate-y-2'}`}></span>
                    <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                    <span className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45' : 'translate-y-2'}`}></span>
                </div>
            </button>

            {/* Mobile Navigation */}
            <div 
                className={`absolute top-[80px] left-0 w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl transition-all duration-500 ease-in-out md:hidden border-b border-slate-800/50 backdrop-blur-lg ${
                    isMenuOpen 
                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                <nav className="flex flex-col p-6 gap-2">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-gray-300 hover:text-cyan-400 flex items-center gap-3">
                        Home
                    </Link>
                    <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-gray-300 hover:text-cyan-400 flex items-center gap-3">
                        Contact Us
                    </Link>
                    <Link to="/gallery" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-gray-300 hover:text-cyan-400 flex items-center gap-3">
                        Gallery
                    </Link>
                    <Link to="/items" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-gray-300 hover:text-cyan-400 flex items-center gap-3">
                        Items
                    </Link>

                    {/* Cart link mobile */}
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-gray-300 hover:text-cyan-400 flex items-center gap-3">
                        <FaCartShopping className="w-5 h-5" />
                        
                    </Link>
                </nav>
            </div>
        </header>
    );
}
