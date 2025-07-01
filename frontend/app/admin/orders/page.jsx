"use client";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FiEye,
  FiRefreshCw,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiPackage,
} from "react-icons/fi";
import axiosInstance from "@/lib/axiosInstance";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const statusOptions = [
  { value: "all", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

function getStatusColor(status) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "SHIPPED":
      return "bg-blue-100 text-blue-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "PENDING":
      return <FiClock className="w-4 h-4" />;
    case "SHIPPED":
      return <FiTruck className="w-4 h-4" />;
    case "DELIVERED":
      return <FiCheckCircle className="w-4 h-4" />;
    case "CANCELLED":
      return <FiXCircle className="w-4 h-4" />;
    default:
      return null;
  }
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: orders = [],
    isLoading,
    mutate,
  } = useSWR("/getAllOrders", fetcher);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.firstName.toLowerCase().includes(search.toLowerCase()) ||
      order.lastName.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await axiosInstance.put(`/updateOrderStatus/${orderId}`, {
        orderStatus: newStatus,
      });
      mutate();
      // Update selectedOrder if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error) {
      alert("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Stats
  const stats = statusOptions
    .filter((s) => s.value !== "all")
    .map((s) => ({
      ...s,
      count: orders.filter((o) => o.orderStatus === s.value).length,
    }));

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button onClick={() => mutate()} variant="outline">
          <FiRefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.value}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className={`rounded-full p-2 ${getStatusColor(s.value)}`}>
                {getStatusIcon(s.value)}
              </span>
              <div>
                <div className="font-bold text-lg">{s.count}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, name, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No orders found.
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold">
                      Order #{order.id.slice(-8)}
                    </span>
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="ml-1">{order.orderStatus}</span>
                    </Badge>
                  </div>
                  <div className="text-gray-600 text-sm">
                    {order.firstName} {order.lastName} &middot; {order.email}
                  </div>
                  <div className="text-gray-600 text-sm">
                    Total: LKR {parseFloat(order.total).toLocaleString()}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDetails(true);
                    }}
                  >
                    <FiEye className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                  <Select
                    value={order.orderStatus}
                    onValueChange={(val) => handleStatusUpdate(order.id, val)}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>

                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Enhanced Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder.id.slice(-8)}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    <FiCalendar className="inline w-4 h-4 mr-1" />
                    Placed on{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="outline"
                  size="sm"
                >
                  <FiX className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <FiPackage className="w-5 h-5 mr-2" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`${getStatusColor(
                        selectedOrder.orderStatus
                      )} text-base px-3 py-1`}
                    >
                      {getStatusIcon(selectedOrder.orderStatus)}
                      <span className="ml-2">{selectedOrder.orderStatus}</span>
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Update Status:
                      </span>
                      <Select
                        value={selectedOrder.orderStatus}
                        onValueChange={(val) =>
                          handleStatusUpdate(selectedOrder.id, val)
                        }
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="SHIPPED">Shipped</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <FiUser className="w-5 h-5 mr-2" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FiUser className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedOrder.firstName} {selectedOrder.lastName}
                        </p>
                        <p className="text-sm text-gray-500">Full Name</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <FiMail className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedOrder.email}
                        </p>
                        <p className="text-sm text-gray-500">Email Address</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FiPhone className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedOrder.phone}
                        </p>
                        <p className="text-sm text-gray-500">Phone Number</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <FiMapPin className="w-5 h-5 mr-2" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">
                          {selectedOrder.address}
                        </p>
                        <p className="text-gray-700">
                          {selectedOrder.city}, {selectedOrder.province}
                        </p>
                        <p className="text-gray-700">
                          {selectedOrder.postalCode}
                        </p>
                        {selectedOrder.additionalNotes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700">
                              Additional Notes:
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {selectedOrder.additionalNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <FiDollarSign className="w-5 h-5 mr-2" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          LKR{" "}
                          {parseFloat(selectedOrder.subtotal).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">
                          LKR{" "}
                          {parseFloat(
                            selectedOrder.shippingCost
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            Total:
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            LKR{" "}
                            {parseFloat(selectedOrder.total).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <FiPackage className="w-5 h-5 mr-2" />
                    Ordered Products ({
                      (selectedOrder.products || []).length
                    }{" "}
                    items)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(selectedOrder.products || []).length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No products found
                      </p>
                    ) : (
                      (selectedOrder.products || []).map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={
                                product.images?.[0]
                                  ? `http://localhost:3001${product.images[0]}`
                                  : "/images.png"
                              }
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {product.brand}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">
                              LKR {parseFloat(product.price).toLocaleString()}
                            </p>
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <p className="text-sm text-gray-400 line-through">
                                  LKR{" "}
                                  {parseFloat(
                                    product.originalPrice
                                  ).toLocaleString()}
                                </p>
                              )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
