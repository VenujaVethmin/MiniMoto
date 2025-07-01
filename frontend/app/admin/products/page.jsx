"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiMoreVertical,
  FiRefreshCw,
  FiGrid,
  FiList,
} from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const AdminProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: products = [],
    error,
    isLoading,
    mutate,
  } = useSWR("/getAllProduct", fetcher);

  const categories = [
    "all",
    "Racing Bikes",
    "Sport Bikes",
    "Cruiser Bikes",
    "Adventure Bikes",
    "Street Bikes",
    "Limited Edition",
  ];

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "stock-low":
          return a.stockCount - b.stockCount;
        default:
          return 0;
      }
    });

  const handleDeleteProduct = async (productId) => {
    setIsDeleting(true);
    try {
      const res = await axiosInstance.delete(`/deleteProduct/${productId}`);
      if (res.status === 200) {
        mutate(); // Refresh the product list
        setShowDeleteModal(false);
        setProductToDelete(null);
        alert("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete ${selectedProducts.length} products?`
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedProducts.map((id) =>
          axiosInstance.delete(`/deleteProduct/${id}`)
        )
      );
      mutate();
      setSelectedProducts([]);
      alert("Products deleted successfully!");
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("Failed to delete some products");
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Management
              </h1>
              <p className="text-gray-600">Manage your product inventory</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => mutate()}
                variant="outline"
                className="hidden sm:flex"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link href="/admin/addProduct">
                <Button className="bg-red-600 hover:bg-red-700">
                  <FiPlus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col space-y-4">
            {/* Search - Full width on mobile */}
            <div className="w-full">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters - Responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="stock-low">
                      Stock: Low to High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <Button
                  onClick={() => mutate()}
                  variant="outline"
                  className="sm:hidden"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </Button>

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

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-blue-800">
                  {selectedProducts.length} product(s) selected
                </span>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleBulkDelete}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                  <Button
                    onClick={() => setSelectedProducts([])}
                    variant="outline"
                    size="sm"
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <span className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </span>
          {filteredProducts.length > 0 && (
            <Button onClick={selectAllProducts} variant="outline" size="sm">
              {selectedProducts.length === filteredProducts.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          )}
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filters"
                : "No products available"}
            </p>
            <Link href="/admin/add-product">
              <Button className="bg-red-600 hover:bg-red-700">
                <FiPlus className="w-4 h-4 mr-2" />
                Add First Product
              </Button>
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={() => toggleProductSelection(product.id)}
                onDelete={() => {
                  setProductToDelete(product);
                  setShowDeleteModal(true);
                }}
                onRefresh={mutate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-2">Delete Product</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{productToDelete?.name}"? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  variant="outline"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(productToDelete.id)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Updated Product Card Component with Mobile-Friendly Actions
const ProductCard = ({
  product,
  viewMode,
  isSelected,
  onSelect,
  onDelete,
  onRefresh,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "bg-red-500" };
    if (stock < 5) return { text: "Low Stock", color: "bg-yellow-500" };
    return { text: "In Stock", color: "bg-green-500" };
  };

  const stockStatus = getStockStatus(product.stockCount);

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="flex items-center p-4">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500 flex-shrink-0"
              />
              <div className="w-12 h-12 sm:w-16 sm:h-16 relative rounded-lg overflow-hidden flex-shrink-0">
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
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  {product.badge && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs w-fit">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {product.brand}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {product.category}
                </p>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="font-bold text-red-600">
                  LKR {parseInt(product.price).toLocaleString()}
                </p>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <p className="text-sm text-gray-400 line-through">
                      LKR {parseInt(product.originalPrice).toLocaleString()}
                    </p>
                  )}
              </div>
              <div className="text-center flex-shrink-0 hidden sm:block">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${stockStatus.color} mb-1`}
                ></span>
                <p className="text-xs text-gray-600">
                  {product.stockCount} units
                </p>
                <p className="text-xs text-gray-500">{stockStatus.text}</p>
              </div>
            </div>

            {/* Mobile and Desktop Actions */}
            <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center space-x-2">
                <Link href={`/admin/edit-product/${product.id}`}>
                  <Button variant="outline" size="sm">
                    <FiEdit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-600 hover:bg-red-50"
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Actions - Dropdown */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FiMoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/edit-product/${product.id}`}
                        className="flex items-center w-full"
                      >
                        <FiEdit className="w-4 h-4 mr-2" />
                        Edit Product
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-red-600 focus:text-red-600"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Delete Product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Mobile Price and Stock Info */}
          <div className="sm:hidden px-4 pb-4 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-red-600">
                  LKR {parseInt(product.price).toLocaleString()}
                </p>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <p className="text-sm text-gray-400 line-through">
                      LKR {parseInt(product.originalPrice).toLocaleString()}
                    </p>
                  )}
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${stockStatus.color}`}
                  ></span>
                  <span className="text-xs text-gray-600">
                    {product.stockCount} units
                  </span>
                </div>
                <p className="text-xs text-gray-500">{stockStatus.text}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-square relative">
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
            {/* Stock status badge */}
            <div className="absolute top-2 left-2">
              <span
                className={`inline-block w-3 h-3 rounded-full ${stockStatus.color}`}
              ></span>
            </div>
            {/* Selection checkbox */}
            <div className="absolute top-2 right-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
            </div>
            {/* Product badge */}
            {product.badge && (
              <Badge className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs">
                {product.badge}
              </Badge>
            )}

            {/* Desktop Actions overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center space-x-2 hidden sm:flex">
              <Link href={`/admin/edit-product/${product.id}`}>
                <Button variant="secondary" size="sm">
                  <FiEdit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 truncate flex-1">
              {product.name}
            </h3>
            {/* Mobile Actions Button */}
            <div className="sm:hidden ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <FiMoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/admin/edit-product/${product.id}`}
                      className="flex items-center w-full"
                    >
                      <FiEdit className="w-4 h-4 mr-2" />
                      Edit Product
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Delete Product
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
          <p className="text-xs text-gray-500 mb-3">{product.category}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-red-600 text-sm sm:text-base">
                LKR {parseInt(product.price).toLocaleString()}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-xs sm:text-sm text-gray-400 line-through ml-2">
                    LKR {parseInt(product.originalPrice).toLocaleString()}
                  </span>
                )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">
                {product.stockCount} units
              </p>
              <p className="text-xs text-gray-500">{stockStatus.text}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminProductsPage;
