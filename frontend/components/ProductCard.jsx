"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/cartContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiHeart,
  FiStar,
  FiShoppingCart,
  FiEye,
  FiCheck,
} from "react-icons/fi";

const ProductCard = ({ bike, index }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Determine stock status based on stockCount
  const isInStock = bike.stockCount > 0;
  const isLowStock = bike.stockCount > 0 && bike.stockCount <= 5;

  const handleAddToCart = (e, bike) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(bike);
    setIsAdded(true);

    // Reset the "added" state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    // Add quick view functionality here
  };

  return (
    <motion.div
      key={bike.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group h-full w-full"
    >
      <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1 overflow-hidden rounded-2xl h-full flex flex-col relative">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
          <Link href={`/product/${bike.id}`} className="block w-full h-full">
            <Image
              src={bike.image}
              alt={bike.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </Link>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {bike.badge && (
              <Badge
                className={`text-white font-medium px-2 py-1 rounded-md text-xs shadow-sm ${
                  bike.badge === "Limited Edition"
                    ? "bg-red-500"
                    : bike.badge === "Best Seller"
                    ? "bg-red-500"
                    : bike.badge === "New Arrival"
                    ? "bg-red-500"
                    : bike.badge === "Premium"
                    ? "bg-red-500"
                    : "bg-red-500"
                }`}
              >
                {bike.badge}
              </Badge>
            )}
            {bike.discount && (
              <Badge className="bg-orange-500 text-white font-medium px-2 py-1 rounded-md text-xs shadow-sm">
                {bike.discount}% OFF
              </Badge>
            )}
            {/* Stock Status Badge */}
            {!isInStock && (
              <Badge className="bg-red-500 text-white font-medium px-2 py-1 rounded-md text-xs shadow-sm">
                Out of Stock
              </Badge>
            )}
            {isLowStock && isInStock && (
              <Badge className="bg-yellow-500 text-white font-medium px-2 py-1 rounded-md text-xs shadow-sm">
                Only {bike.stockCount} left
              </Badge>
            )}
          </div>

         

          {/* Out of Stock Overlay */}
          {!isInStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
              <div className="text-center">
                <Badge className="bg-gray-800 text-white px-4 py-2 text-sm font-medium mb-2">
                  Out of Stock
                </Badge>
                <p className="text-white text-xs">Currently unavailable</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Container */}
        <CardContent className="p-4 flex-grow flex flex-col">
          {/* Brand and Rating Row */}
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="outline"
              className="text-gray-600 border-gray-300 font-medium text-xs px-2 py-1"
            >
              {bike.brand}
            </Badge>
            <div className="flex items-center gap-1">
              <FiStar className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-700">
                {bike.rating}
              </span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/product/${bike.id}`} className="block mb-4 flex-grow">
            <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 leading-tight">
              {bike.name}
            </h3>
          </Link>

          {/* Stock Information */}
          <div className="mb-3">
            {isInStock ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isLowStock ? "bg-yellow-500" : "bg-green-500"
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${
                      isLowStock ? "text-yellow-600" : "text-green-600"
                    }`}
                  >
                    {isLowStock ? `Only ${bike.stockCount} left` : "In Stock"}
                  </span>
                </div>
                {bike.stockCount > 5 && (
                  <span className="text-xs text-gray-500">
                    ({bike.stockCount} available)
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs font-medium text-red-600">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Price and Add to Cart Row */}
          <div className="flex items-end justify-between gap-3 mt-auto">
            {/* Price Section */}
            <div className="flex flex-col min-w-0 flex-1">
              <span
                className={`text-lg sm:text-xl font-bold ${
                  isInStock
                    ? "bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"
                    : "text-gray-400"
                }`}
              >
               Rs. {bike.price}
              </span>
              {bike.originalPrice && (
                <span className="text-gray-400 line-through text-xs">
                  {bike.originalPrice}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              size="sm"
              className={`transition-all duration-300 rounded-full px-4 py-2 text-xs font-medium min-w-[90px] h-8 flex-shrink-0 ${
                !isInStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isAdded
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg hover:shadow-red-500/25"
              }`}
              onClick={(e) => handleAddToCart(e, bike)}
              disabled={!isInStock || isAdded}
            >
              {!isInStock ? (
                "Out of Stock"
              ) : isAdded ? (
                <>
                  <FiCheck className="w-3 h-3 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <FiShoppingCart className="w-3 h-3 mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </CardContent>

     
      </Card>
    </motion.div>
  );
};

export default ProductCard;
