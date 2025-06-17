"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowUp,
} from "react-icons/fi";
import { useState, useEffect } from "react";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="relative w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  MiniMoto.lk
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Premium Collectibles</p>
              </div>
            </Link>

            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Sri Lanka's premier destination for authentic miniature superbike collectibles.
            </p>

            {/* Social Media */}
            <div className="flex space-x-3">
              {[
                { icon: FiFacebook, href: "#" },
                { icon: FiInstagram, href: "#" },
                { icon: FiTwitter, href: "#" },
                { icon: FiYoutube, href: "#" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-red-400 transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-red-400 transition-colors text-sm">Contact</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-red-400 transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-red-400 transition-colors text-sm">Shipping</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-red-400 transition-colors text-sm">Returns</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <FiMapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm">Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FiPhone className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm">+94 77 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FiMail className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm">info@minimoto.lk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; {(new Date).getFullYear()} MiniMoto.lk. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-red-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-red-400 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <FiArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </footer>
  );
};

export default Footer;