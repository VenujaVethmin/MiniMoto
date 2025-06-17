"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiMenu,
  FiX,
  FiEye,
  FiPhone,
  FiMapPin,
  FiMail,
} from "react-icons/fi";
import Link from "next/link";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample data with enhanced details
  const stats = {
    totalSales: 45230,
    totalOrders: 156,
    totalCustomers: 89,
    totalProducts: 24,
  };

  const recentOrders = [
    {
      id: "#001",
      customer: "John Doe",
      email: "john.doe@email.com",
      phone: "+94 77 123 4567",
      address: "123 Main Street, Colombo 03, Western Province",
      product: "Yamaha YZF-R1M",
      productImage: "/bike-1.jpg",
      quantity: 1,
      amount: 8500,
      status: "Completed",
      orderDate: "2024-06-15",
      shippingMethod: "Express Delivery",
    },
    {
      id: "#002",
      customer: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+94 71 987 6543",
      address: "456 Oak Avenue, Kandy, Central Province",
      product: "Honda CBR",
      productImage: "/bike-1.jpg",
      quantity: 2,
      amount: 7200,
      status: "Pending",
      orderDate: "2024-06-16",
      shippingMethod: "Standard Delivery",
    },
    {
      id: "#003",
      customer: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+94 75 555 1234",
      address: "789 Pine Road, Galle, Southern Province",
      product: "Kawasaki Ninja",
      productImage: "/bike-1.jpg",
      quantity: 1,
      amount: 6800,
      status: "Processing",
      orderDate: "2024-06-17",
      shippingMethod: "Express Delivery",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Yamaha YZF-R1M",
      brand: "Yamaha",
      image: "/bike-1.jpg",
      price: 8500,
      originalPrice: 10000,
      stock: 12,
      status: "Active",
      category: "Racing Bikes",
      badge: "Limited Edition",
    },
    {
      id: 2,
      name: "Honda CBR",
      brand: "Honda",
      image: "/bike-1.jpg",
      price: 7200,
      originalPrice: 8000,
      stock: 8,
      status: "Active",
      category: "Sport Bikes",
      badge: "Best Seller",
    },
    {
      id: 3,
      name: "Kawasaki Ninja",
      brand: "Kawasaki",
      image: "/bike-1.jpg",
      price: 6800,
      originalPrice: 7500,
      stock: 5,
      status: "Low Stock",
      category: "Street Bikes",
      badge: "Sale",
    },
  ];

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: FiTrendingUp },
    { id: "orders", label: "Orders", icon: FiShoppingBag },
    { id: "products", label: "Products", icon: FiUsers },
    { id: "customers", label: "Customers", icon: FiUsers },
  ];

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Order Details - {order.id}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <FiX className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <FiUsers className="w-4 h-4 mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {order.customer}
                    </p>
                    <p className="flex items-center">
                      <FiMail className="w-4 h-4 mr-2" />
                      {order.email}
                    </p>
                    <p className="flex items-center">
                      <FiPhone className="w-4 h-4 mr-2" />
                      {order.phone}
                    </p>
                    <p className="flex items-start">
                      <FiMapPin className="w-4 h-4 mr-2 mt-0.5" />
                      {order.address}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <FiShoppingBag className="w-4 h-4 mr-2" />
                    Order Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Order Date:</strong> {order.orderDate}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {order.quantity}
                    </p>
                    <p>
                      <strong>Shipping:</strong> {order.shippingMethod}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> LKR{" "}
                      {order.amount.toLocaleString()}
                    </p>
                    <div className="flex items-center">
                      <strong className="mr-2">Status:</strong>
                      <Badge
                        className={
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Information */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                    <Image
                      src={order.productImage}
                      alt={order.product}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{order.product}</h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {order.quantity}
                    </p>
                    <p className="text-lg font-bold text-red-600">
                      LKR {order.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="w-5 h-5" />
          </Button>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 ${
                activeTab === item.id
                  ? "bg-red-50 text-red-600 border-r-2 border-red-600"
                  : "text-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-4"
                onClick={() => setSidebarOpen(true)}
              >
                <FiMenu className="w-5 h-5" />
              </Button>
              <h2 className="text-2xl font-semibold text-gray-900 capitalize">
                {activeTab}
              </h2>
            </div>
            <Link href={"/admin/addProduct"}>
              <Button className="bg-red-600 hover:bg-red-700">
                <FiPlus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Sales</p>
                        <p className="text-2xl font-bold">
                          LKR {stats.totalSales.toLocaleString()}
                        </p>
                      </div>
                      <FiDollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold">
                          {stats.totalOrders}
                        </p>
                      </div>
                      <FiShoppingBag className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Customers</p>
                        <p className="text-2xl font-bold">
                          {stats.totalCustomers}
                        </p>
                      </div>
                      <FiUsers className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold">
                          {stats.totalProducts}
                        </p>
                      </div>
                      <FiTrendingUp className="w-8 h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3">Order ID</th>
                          <th className="text-left py-3">Customer</th>
                          <th className="text-left py-3">Product</th>
                          <th className="text-left py-3">Amount</th>
                          <th className="text-left py-3">Status</th>
                          <th className="text-left py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="py-3">{order.id}</td>
                            <td className="py-3">
                              <div>
                                <p className="font-medium">{order.customer}</p>
                                <p className="text-sm text-gray-500">
                                  {order.phone}
                                </p>
                              </div>
                            </td>
                            <td className="py-3">{order.product}</td>
                            <td className="py-3">
                              LKR {order.amount.toLocaleString()}
                            </td>
                            <td className="py-3">
                              <Badge
                                className={
                                  order.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <FiEye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "products" && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Product Management
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Product</th>
                        <th className="text-left py-3">Brand</th>
                        <th className="text-left py-3">Price</th>
                        <th className="text-left py-3">Stock</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-left py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="py-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">
                                  {product.category}
                                </p>
                                {product.badge && (
                                  <Badge className="text-xs mt-1">
                                    {product.badge}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3">{product.brand}</td>
                          <td className="py-3">
                            <div>
                              <p className="font-medium">
                                LKR {product.price.toLocaleString()}
                              </p>
                              {product.originalPrice > product.price && (
                                <p className="text-sm text-gray-400 line-through">
                                  LKR {product.originalPrice.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-3">{product.stock}</td>
                          <td className="py-3">
                            <Badge
                              className={
                                product.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {product.status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <FiEdit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "orders" && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Order ID</th>
                        <th className="text-left py-3">Customer</th>
                        <th className="text-left py-3">Contact</th>
                        <th className="text-left py-3">Product</th>
                        <th className="text-left py-3">Amount</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-left py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-3">{order.id}</td>
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{order.customer}</p>
                              <p className="text-sm text-gray-500">
                                {order.orderDate}
                              </p>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="text-sm">
                              <p className="flex items-center">
                                <FiPhone className="w-3 h-3 mr-1" />
                                {order.phone}
                              </p>
                              <p className="flex items-center mt-1">
                                <FiMail className="w-3 h-3 mr-1" />
                                {order.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 relative rounded overflow-hidden">
                                <Image
                                  src={order.productImage}
                                  alt={order.product}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm">{order.product}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            LKR {order.amount.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <Badge
                              className={
                                order.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <FiEye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <FiEdit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "customers" && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Customer Management
                </h3>
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Customer management features coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default AdminDashboard;
