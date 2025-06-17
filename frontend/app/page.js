"use client";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiAward,
  FiCheck,
  FiChevronRight,
  FiShield,
  FiStar,
  FiTruck
} from "react-icons/fi";

const HomePage = () => {

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
    {
      id: 2,
      name: "Kawasaki Ninja H2R",
      brand: "Kawasaki",
      price: "LKR 9,200",
      image: "/bike-1.jpg",
      rating: 4.8,
      badge: "Best Seller",
    },
    {
      id: 3,
      name: "Ducati Panigale V4",
      brand: "Ducati",
      price: "LKR 11,500",
      image: "/bike-1.jpg",
      rating: 5.0,
      badge: "Premium",
    },
    {
      id: 4,
      name: "Honda CBR1000RR",
      brand: "Honda",
      price: "LKR 7,800",
      image: "/bike-1.jpg",
      rating: 4.7,
      badge: "New Arrival",
    },
  ];

  const whyChooseUs = [
    {
      icon: <FiShield className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Detailed Replicas",
      description:
        "Every detail perfectly recreated from the original superbikes",
      features: [
        "1:12 Scale Precision",
        "Authentic Colors",
        "Real Brand Licensing",
      ],
    },
    {
      icon: <FiAward className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Premium Quality",
      description: "High-grade materials and precision engineering",
      features: ["Die-cast Metal", "Quality Plastics", "Durable Construction"],
    },
    {
      icon: <FiTruck className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Island-wide Delivery",
      description: "Fast and secure delivery across Sri Lanka",
      features: ["2-3 Day Delivery", "Secure Packaging", "Free Returns"],
    },
  ];


  const testimonials = [
    {
      name: "Rajesh Perera",
      location: "Colombo",
      review:
        "Amazing quality! My son absolutely loves his Yamaha replica. Worth every rupee!",
      rating: 5,
      avatar: "RP",
    },
    {
      name: "Amila Silva",
      location: "Kandy",
      review:
        "Perfect gift for motorcycle enthusiasts. The attention to detail is incredible.",
      rating: 5,
      avatar: "AS",
    },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Hero Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        <motion.div
          className="relative z-20 text-center px-4 w-full max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-red-400 font-medium text-xs sm:text-sm tracking-wider uppercase">
              Premium Collectibles
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-tight px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent block">
              Own the Track.
            </span>
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent block">
              In Miniature.
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Precision-crafted superbike replicas that capture every detail of
            legendary racing machines. Perfect for collectors and enthusiasts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
          >
            <Link href="/all">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-full shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 border-0"
              >
                Explore Collection
                <FiArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-2xl mx-auto px-4"
          >
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                50+
              </div>
              <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                Models
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                1000+
              </div>
              <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                4.9★
              </div>
              <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                Rating
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Premium Features Strip */}
      <section className="py-6 sm:py-8 bg-white border-b border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span>Free Island-wide Shipping</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span>Authentic Licensed Products</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span>30-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span>Premium Gift Packaging</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bikes */}
      <section className="py-16 sm:py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-block bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Premium Collection
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 px-2">
              Featured{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Superbikes
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Discover our meticulously crafted collection of legendary racing
              machines
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredBikes.map((bike, index) => (
              <ProductCard key={bike.id} bike={bike} index={index}/>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link href={"/all"}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base"
              >
                View All Models
                <FiChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-block bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 px-2">
              Premium{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Quality
              </span>{" "}
              Guaranteed
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {whyChooseUs.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group h-full w-full"
              >
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 rounded-2xl h-full flex flex-col w-full">
                  <div className="text-center flex-grow flex flex-col">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <div className="text-red-600">{feature.icon}</div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-red-600 transition-colors min-h-[2rem]">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 flex-grow min-h-[3rem] text-sm sm:text-base">
                      {feature.description}
                    </p>

                    <div className="space-y-2 mt-auto">
                      {feature.features.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-center text-xs sm:text-sm text-gray-500"
                        >
                          <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-center">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Testimonials */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-block bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Customer Reviews
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 px-2">
              What Our{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Customers
              </span>{" "}
              Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="h-full w-full"
              >
                <Card className="bg-white border-0 shadow-lg p-6 sm:p-8 rounded-2xl h-full flex flex-col w-full">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed flex-grow min-h-[4rem]">
                    {testimonial.review}
                  </p>
                  <div className="flex items-center mt-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 flex-shrink-0 text-sm sm:text-base">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm sm:text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-xs sm:text-sm">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
