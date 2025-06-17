"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiStar,
  FiHeart,
  FiShoppingCart,
  FiGrid,
  FiList,
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
  FiEye,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";


const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const featuredBikes = [
    {
      id: 1,
      name: "Yamaha YZF-R1M",
      brand: "Yamaha",
      price: "LKR 8,500",
      originalPrice: "LKR 10,000",
      image: "/bike-1.jpg",
      rating: 4.9,
      badge: "Limited Edition",
      stockCount: 12,
    },
    
  ];

  useEffect(() => {
    setProducts(featuredBikes);
  }, []);

  const getSortedProducts = () => {
    let sorted = [...products];
    
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort((a, b) => b.isNew - a.isNew);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // featured
        sorted.sort((a, b) => b.featured - a.featured);
    }

    return sorted;
  };

  const sortedProducts = getSortedProducts();
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

 

  return (
    <>
     
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-red-600">Home</Link>
              <FiChevronRight className="w-4 h-4" />
              <span className="text-gray-900">All Collections</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Premium{" "}
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Collection
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Discover our complete range of meticulously crafted superbike replicas
            </motion.p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-none ${viewMode === "grid" ? "bg-red-50 text-red-600" : ""}`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`rounded-none ${viewMode === "list" ? "bg-red-50 text-red-600" : ""}`}
                  >
                    <FiList className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${currentPage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "space-y-6"
              }
            >
              {featuredBikes.map((product ,index) => (
                <ProductCard
                  key={product.id}
                  bike={product}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-gray-300"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </Button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                    className={
                      currentPage === index + 1 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "border-gray-300"
                    }
                  >
                    {index + 1}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-gray-300"
                >
                  <FiChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </>
  );
};

export default CollectionPage;