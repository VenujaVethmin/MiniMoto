"use client";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiCheck,
  FiChevronRight,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiStar,
  FiTruck,
} from "react-icons/fi";

import axiosInstance from "@/lib/axiosInstance";
import { useParams } from "next/navigation";

import useSWR from "swr";


const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const ProductDetailPage = () => {

  const params = useParams();

  const {
    data: product,
    isLoading,
    mutate,
  } = useSWR(`/getProductById/${params.id}`, fetcher);

  console.log(product)


  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();


  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity(Math.min(quantity + 1, product.stockCount));
    } else {
      setQuantity(Math.max(quantity - 1, 1));
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: `LKR ${product.price}`,
      image: product.images[0],
      quantity: quantity,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">
              Home
            </Link>
            <FiChevronRight className="w-4 h-4" />
            <Link href="/all" className="hover:text-red-600">
              All Bikes
            </Link>
            <FiChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{product?.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={product?.images ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product?.images?.[selectedImage]}` : "/images.png"}
                  alt={product?.name || "Product image"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Discount Badge */}
              {product?.discount > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-500 text-white font-semibold">
                    {product?.discount}% OFF
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product?.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`}
                    alt={`View ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <Badge variant="outline" className="text-gray-600 mb-2">
                {product?.brand}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product?.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product?.rating)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product?.rating} ({product?.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-red-600">
                LKR {product?.price.toLocaleString()}
              </span>
              {product?.originalPrice > product?.price && (
                <span className="text-xl text-gray-400 line-through">
                  LKR {product?.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <FiCheck className="w-5 h-5 text-green-500" />
              <span className="text-green-600 font-medium">
                In Stock ({product?.stockCount} available)
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product?.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    onClick={() => handleQuantityChange("decrease")}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    onClick={() => handleQuantityChange("increase")}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    disabled={quantity >= product?.stockCount}
                  >
                    <FiPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
                >
                  <FiShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
               
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-around pt-6 border-t border-gray-200">
              <div className="text-center">
                <FiTruck className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <p className="text-sm font-medium">Free Shipping</p>
              </div>
              <div className="text-center">
                <FiCheck className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-medium">Authentic</p>
              </div>
              <div className="text-center">
                <FiHeart className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <p className="text-sm font-medium">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You may also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts?.map((item , index) => (
            <ProductCard bike={item} index={index} key={item.id}/>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProductDetailPage;
