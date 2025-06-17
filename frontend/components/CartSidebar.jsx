
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiX,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cartContext";


const CartSidebar = ({ isOpen, onClose }) => {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    return `LKR ${numericPrice.toLocaleString()}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <FiShoppingBag className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Shopping Cart
                </h2>
                {totalItems > 0 && (
                  <Badge className="bg-red-500 text-white">{totalItems}</Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add some bikes to get started!
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">
                          {item.brand}
                        </p>
                        <p className="font-bold text-red-600 text-sm">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-gray-600 hover:text-red-600"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <FiMinus className="w-3 h-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-gray-600 hover:text-red-600"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <FiPlus className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Clear Cart Button */}
                  {items.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                      className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Clear Cart
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    LKR {totalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold"
                  onClick={onClose}
                >
                  Proceed to Checkout
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </Button>

                {/* Continue Shopping */}
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-xl"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
