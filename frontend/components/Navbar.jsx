"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiHeart,
  FiChevronDown,
  FiPhone,
  FiMail,
  FiMapPin,
  FiLogIn,
  FiUserPlus,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import CartSidebar from "./CartSidebar";
import { useCart } from "@/context/cartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // You can manage this with your auth context

  const { totalItems } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown")) {
        setIsUserDropdownOpen(false);
      }
      if (!event.target.closest(".nav-dropdown")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const baseNavigation = [
    { name: "Home", href: "/" },
    { name: "All", href: "/all" },
    { name: "Contact", href: "/contact" },
  ];

  const adminNavigation = [
    { name: "Orders", href: "/admin/orders" },
    { name: "Products", href: "/admin/products" },
   
  ];

  const navigation = pathname.startsWith("/admin")
    ? [...baseNavigation, ...adminNavigation]
    : baseNavigation;


  

  // Check if link is active
  const isActiveLink = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleSignIn = () => {
    // Handle sign in logic here
    console.log("Sign in clicked");
    setIsUserDropdownOpen(false);
  };

  const handleSignUp = () => {
    // Handle sign up logic here
    console.log("Sign up clicked");
    setIsUserDropdownOpen(false);
  };

  const handleSignOut = () => {
    // Handle sign out logic here
    setIsLoggedIn(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <FiPhone className="w-4 h-4" />
              <span> +94 76 113 6607</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-xs">
            <span>Free shipping on orders over LKR 10,000</span>
            <span className="text-red-400">|</span>
            <span>30-Day Returns</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">MR</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  MiniRider.lk
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  Premium Collectibles
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative nav-dropdown"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-1 font-medium transition-all duration-200 py-2 relative ${
                      isActiveLink(item.href)
                        ? "text-red-600"
                        : "text-gray-700 hover:text-red-600"
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.dropdown && (
                      <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
                    )}
                    {/* Active indicator */}
                    {isActiveLink(item.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red-600 rounded-full"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-red-600 hover:bg-red-50 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <FiShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* User Account Dropdown */}
              <div className="relative user-dropdown">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <FiUser className="w-5 h-5" />
                </Button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      {!isLoggedIn ? (
                        // Not logged in - show sign in/up options
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm text-gray-600">
                              Welcome to MiniMoto.lk
                            </p>
                          </div>
                          <button
                            onClick={handleSignIn}
                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            <FiLogIn className="w-4 h-4 mr-3" />
                            Sign In
                          </button>
                         
                          <div className="px-4 py-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Sign in to track orders and save favorites
                            </p>
                          </div>
                        </>
                      ) : (
                        // Logged in - show user options
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                              John Doe
                            </p>
                            <p className="text-xs text-gray-500">
                              john.doe@email.com
                            </p>
                          </div>
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <FiUser className="w-4 h-4 mr-3" />
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="flex items-center px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <FiShoppingCart className="w-4 h-4 mr-3" />
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <FiHeart className="w-4 h-4 mr-3" />
                            Wishlist
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <FiSettings className="w-4 h-4 mr-3" />
                            Settings
                          </Link>
                          <div className="border-t border-gray-100 mt-2">
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              <FiLogOut className="w-4 h-4 mr-3" />
                              Sign Out
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-700"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search bikes..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Mobile Navigation */}
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between py-3 font-medium transition-colors duration-200 ${
                        isActiveLink(item.href)
                          ? "text-red-600"
                          : "text-gray-700 hover:text-red-600"
                      }`}
                      onClick={() => !item.dropdown && setIsOpen(false)}
                    >
                      <span>{item.name}</span>
                      {item.dropdown && <FiChevronDown className="w-4 h-4" />}
                    </Link>

                    {/* Mobile Dropdown */}
                    {item.dropdown && (
                      <div className="pl-4 space-y-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Mobile Account Actions */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {!isLoggedIn ? (
                    <>
                      <Button
                        onClick={handleSignIn}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl py-3"
                      >
                        <FiLogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <Button
                        onClick={handleSignUp}
                        variant="outline"
                        className="w-full border-red-500 text-red-600 hover:bg-red-50 rounded-xl py-3"
                      >
                        <FiUserPlus className="w-4 h-4 mr-2" />
                        Create Account
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl py-3">
                      <FiUser className="w-4 h-4 mr-2" />
                      My Account
                    </Button>
                  )}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 hover:border-red-500 hover:text-red-600 rounded-xl py-3"
                    >
                      <FiHeart className="w-4 h-4 mr-2" />
                      Wishlist (2)
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 hover:border-red-500 hover:text-red-600 rounded-xl py-3"
                      onClick={() => {
                        setIsOpen(false);
                        setIsCartOpen(true);
                      }}
                    >
                      <FiShoppingCart className="w-4 h-4 mr-2" />
                      Cart ({totalItems})
                    </Button>
                  </div>
                </div>

                {/* Mobile Contact Info */}
                <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FiPhone className="w-4 h-4" />
                    <span> +94 76 113 6607</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>Colombo, Sri Lanka</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
