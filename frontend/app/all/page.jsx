"use client";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiPackage,
  FiSearch,
  FiRefreshCw,
  FiHome,
} from "react-icons/fi";
import { useRef, useCallback } from "react";

import axiosInstance from "@/lib/axiosInstance";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

// AI-Generated No Products Component
const NoProductsFound = ({ isLoading, error, onRetry }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiPackage className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <p className="text-gray-600 mt-4 text-lg">Loading amazing products...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="relative mb-6">
          {/* AI-Generated Error Icon */}
          <svg
            className="w-24 h-24 text-gray-300"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4" strokeDasharray="10,5" />
            <path d="M70 70L130 130M130 70L70 130" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="100" cy="100" r="15" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          We couldn't load the products right now. Please check your connection and try again.
        </p>
        <div className="flex space-x-4">
          <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline">
              <FiHome className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="relative mb-8">
        {/* AI-Generated No Products Illustration */}
        <svg
          className="w-32 h-32 text-gray-300"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Empty box */}
          <rect x="50" y="80" width="100" height="80" stroke="currentColor" strokeWidth="3" fill="none" rx="4"/>
          <path d="M50 100 L100 80 L150 100" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path d="M100 80 L100 160" stroke="currentColor" strokeWidth="2" strokeDasharray="5,3"/>
          
          {/* Floating elements */}
          <circle cx="40" cy="60" r="3" fill="currentColor" opacity="0.4">
            <animate attributeName="cy" values="60;50;60" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="160" cy="50" r="2" fill="currentColor" opacity="0.4">
            <animate attributeName="cy" values="50;40;50" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="170" cy="70" r="2.5" fill="currentColor" opacity="0.4">
            <animate attributeName="cy" values="70;60;70" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          
          {/* Search magnifying glass */}
          <circle cx="130" cy="45" r="8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M136 51L145 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        </svg>
      </div>

      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Found</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          We couldn't find any products matching your criteria. Try adjusting your filters or browse our featured collection.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <FiHome className="w-4 h-4 mr-2" />
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-yellow-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </motion.div>
  );
};

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const {
    data: featuredBikes,
    error,
    isLoading,
    mutate,
  } = useSWR("/getAllProduct", fetcher);

  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
    setProducts([]);
    setHasMore(true);
  }, [sortBy, viewMode]);

  const getSortedProducts = () => {
    if (!featuredBikes || featuredBikes.length === 0) return [];
    
    let sorted = [...featuredBikes];

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
      default:
        sorted.sort((a, b) => b.featured - a.featured);
    }

    return sorted;
  };

  const sortedProducts = getSortedProducts();
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-red-600">
                Home
              </Link>
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
              Discover our complete range of meticulously crafted superbike
              replicas
            </motion.p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Show controls only when we have products or are loading */}
          {(featuredBikes && featuredBikes.length > 0) || isLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    {isLoading ? "Loading..." : 
                      `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, sortedProducts.length)} of ${sortedProducts.length} products`
                    }
                  </span>
                </div>

                <div className="flex items-center space-x-4">
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

                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-none ${
                        viewMode === "grid" ? "bg-red-50 text-red-600" : ""
                      }`}
                    >
                      <FiGrid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`rounded-none ${
                        viewMode === "list" ? "bg-red-50 text-red-600" : ""
                      }`}
                    >
                      <FiList className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Products Grid or No Products State */}
          {!featuredBikes || featuredBikes.length === 0 ? (
            <NoProductsFound 
              isLoading={isLoading} 
              error={error} 
              onRetry={() => mutate()}
            />
          ) : (
            <>
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
                  {currentProducts.map((product, index) => (
                    <ProductCard key={product.id} bike={product} index={index} />
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="border-gray-300"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CollectionPage;