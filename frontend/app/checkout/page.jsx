"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cartContext";
import {
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiUser,
  FiMail,
  FiEdit,
  FiCheck,
  FiTruck,
  FiCreditCard,
  FiDollarSign,
  FiPackage,
  FiCalendar,
  FiCopy,
} from "react-icons/fi";
import axiosInstance from "@/lib/axiosInstance";

const BillingPage = () => {
  const { items: cartItems = [], totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});

  const provinces = [
    "Western Province",
    "Central Province",
    "Southern Province",
    "Northern Province",
    "Eastern Province",
    "North Western Province",
    "North Central Province",
    "Uva Province",
    "Sabaragamuwa Province",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!billingInfo.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!billingInfo.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!billingInfo.email.trim()) newErrors.email = "Email is required";
    if (!billingInfo.phone.trim()) newErrors.phone = "Phone number is required";
    if (!billingInfo.address.trim()) newErrors.address = "Address is required";
    if (!billingInfo.city.trim()) newErrors.city = "City is required";
    if (!billingInfo.province) newErrors.province = "Province is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (billingInfo.email && !emailRegex.test(billingInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Phone validation (Sri Lankan format)
    const phoneRegex = /^(\+94|0)?[0-9]{9}$/;
    if (
      billingInfo.phone &&
      !phoneRegex.test(billingInfo.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    return `MM${Date.now().toString().slice(-6)}${Math.floor(
      Math.random() * 100
    )
      .toString()
      .padStart(2, "0")}`;
  };

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    // You could add a toast notification here
    alert("Order ID copied to clipboard!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!cartItems || cartItems.length === 0) return;

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const orderData = {
        orderId,
        customerInfo: billingInfo,
        items: cartItems,
        subtotal: calculateSubtotal(),
        shipping: subtotal >= 5000 ? 0 : 500,
        total: calculateSubtotal() + (calculateSubtotal() >= 5000 ? 0 : 500),
        orderDate: new Date().toISOString(),
        status: "Pending",
      };

      const res = await axiosInstance.post("/place-order", {
        ...billingInfo,
        products: cartItems.map((item) => item.id),
      });

      if (res.status === 201) {
        setOrderDetails(orderData);
        setOrderPlaced(true);
        if (clearCart) clearCart();
      }
    } catch (error) {
      console.error("Order error:", error);
      window.alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;

    return cartItems.reduce((total, item) => {
      if (!item || !item.price) return total;

      const price =
        typeof item.price === "string"
          ? parseInt(item.price.replace(/[^\d]/g, ""))
          : item.price;

      const quantity = item.quantity || 1;

      return total + price * quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shippingCost;

  // Loading state while cart context is initializing
  if (cartItems === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (orderPlaced && orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600">
              Thank you for your order. We'll contact you shortly to confirm
              delivery details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Order Information</h2>
                    <Badge className="bg-green-100 text-green-800">
                      {orderDetails.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiCalendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold">
                          {new Date(orderDetails.orderDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <FiTruck className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Estimated Delivery
                        </p>
                        <p className="font-semibold">2-3 Business Days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ordered Items */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Ordered Items</h2>
                  <div className="space-y-4">
                    {orderDetails.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                          <Image
                            src={
                              item.images?.[0]
                                ? `http://localhost:3001${item.images[0]}`
                                : "/images.png"
                            }
                            alt={item.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </span>
                            <span className="font-semibold">
                              LKR{" "}
                              {(
                                (typeof item.price === "string"
                                  ? parseInt(item.price.replace(/[^\d]/g, ""))
                                  : item.price) * item.quantity
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Delivery Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <FiUser className="w-4 h-4 mr-2" />
                        Customer Details
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Name:</strong>{" "}
                          {orderDetails.customerInfo.firstName}{" "}
                          {orderDetails.customerInfo.lastName}
                        </p>
                        <p className="flex items-center">
                          <FiMail className="w-4 h-4 mr-2" />
                          {orderDetails.customerInfo.email}
                        </p>
                        <p className="flex items-center">
                          <FiPhone className="w-4 h-4 mr-2" />
                          {orderDetails.customerInfo.phone}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        Shipping Address
                      </h3>
                      <div className="text-sm text-gray-600">
                        <p>{orderDetails.customerInfo.address}</p>
                        <p>
                          {orderDetails.customerInfo.city},{" "}
                          {orderDetails.customerInfo.province}
                        </p>
                        {orderDetails.customerInfo.postalCode && (
                          <p>
                            Postal Code: {orderDetails.customerInfo.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {orderDetails.customerInfo.additionalNotes && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm">
                        <strong>Additional Notes:</strong>{" "}
                        {orderDetails.customerInfo.additionalNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Total */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Total</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>LKR {orderDetails.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>
                        {orderDetails.shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `LKR ${orderDetails.shipping}`
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span className="text-red-600">
                          LKR {orderDetails.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-800">
                      <FiDollarSign className="w-5 h-5" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Payment will be collected upon delivery
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Link href="/">
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Continue Shopping
                      </Button>
                    </Link>
                 
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.print()}
                    >
                      Print Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Need Help?</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center">
                      <FiPhone className="w-4 h-4 mr-2" />
                      +94 76 113 6607
                    </p>
                    <p className="flex items-center">
                      <FiMail className="w-4 h-4 mr-2" />
                      support@minimoto.lk
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link href="/all">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Rest of the checkout form remains the same */}
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="outline" size="sm">
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FiDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Cash on Delivery</h2>
                    <p className="text-sm text-gray-600">
                      Pay when you receive your order
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Payment will be collected upon
                    delivery. Please have the exact amount ready.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-6">
                  Billing & Delivery Information
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={billingInfo.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={billingInfo.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={billingInfo.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="john.doe@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={billingInfo.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="+94 77 123 4567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={billingInfo.address}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="123 Main Street, Apartment/House Number"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={billingInfo.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Colombo"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province *
                      </label>
                      <select
                        name="province"
                        value={billingInfo.province}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          errors.province ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Province</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                      {errors.province && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.province}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={billingInfo.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="10100"
                      />
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={billingInfo.additionalNotes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Cart Items */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                        <Image
                          src={
                            item.images?.[0]
                              ? `http://localhost:3001${item.images[0]}`
                              : "/images.png"
                          }
                          alt={item.name || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {item.name || "Product"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.brand || "Brand"}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">
                            Qty: {item.quantity || 1}
                          </span>
                          <span className="font-medium">
                            {item.price || "LKR 0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `LKR ${shippingCost}`
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-red-600">
                        LKR {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {shippingCost > 0 && subtotal > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Add LKR {(5000 - subtotal).toLocaleString()} more for free
                      shipping!
                    </p>
                  </div>
                )}

                {/* Trust Indicators */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiTruck className="w-4 h-4 text-green-500" />
                    <span>Fast delivery within 2-3 days</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span>100% Authentic products</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiDollarSign className="w-4 h-4 text-green-500" />
                    <span>Cash on delivery available</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || !cartItems || cartItems.length === 0
                  }
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 py-3 text-lg font-semibold"
                >
                  {isSubmitting
                    ? "Placing Order..."
                    : `Place Order - LKR ${total.toLocaleString()}`}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
