"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiUpload,
  FiX,
  FiSave,
  FiEye,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    description: "",
    stockCount: "",
    category: "",
    badge: "",
    features: [""],
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Racing Bikes",
    "Sport Bikes",
    "Cruiser Bikes",
    "Adventure Bikes",
    "Street Bikes",
    "Limited Edition",
  ];

  const badges = [
    "New Arrival",
    "Best Seller",
    "Limited Edition",
    "Sale",
    "Featured",
    "Premium",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 6) {
      alert("Maximum 6 images allowed");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewImages(newPreviews);
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert("Product added successfully!");
      setIsSubmitting(false);
      // Reset form or redirect
    }, 2000);
  };

  const calculateDiscount = () => {
    if (formData.price && formData.originalPrice) {
      const discount = (
        ((formData.originalPrice - formData.price) / formData.originalPrice) *
        100
      ).toFixed(0);
      return discount > 0 ? discount : 0;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <FiArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Product
              </h1>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <FiEye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                <FiSave className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter brand name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge
                    </label>
                    <select
                      name="badge"
                      value={formData.badge}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">No badge</option>
                      {badges.map((badge) => (
                        <option key={badge} value={badge}>
                          {badge}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Pricing & Stock</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (LKR) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="8500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (LKR)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Count *
                    </label>
                    <input
                      type="number"
                      name="stockCount"
                      value={formData.stockCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="12"
                      required
                    />
                  </div>
                </div>
                {calculateDiscount() > 0 && (
                  <div className="mt-4">
                    <Badge className="bg-green-100 text-green-800">
                      {calculateDiscount()}% Discount
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter product description..."
                  required
                />
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Key Features</h2>
                  <Button
                    type="button"
                    onClick={addFeature}
                    variant="outline"
                    size="sm"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeFeature(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                        >
                          <FiMinus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Product Images</h2>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload images (Max 6)
                    </p>
                  </label>
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative rounded-lg overflow-hidden">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          size="sm"
                        >
                          <FiX className="w-3 h-3" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs">
                            Main
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Preview</h2>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    {previewImages[0] ? (
                      <Image
                        src={previewImages[0]}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </div>
                  <div>
                    {formData.badge && (
                      <Badge className="mb-2 text-xs">{formData.badge}</Badge>
                    )}
                    <h3 className="font-medium text-sm">
                      {formData.name || "Product Name"}
                    </h3>
                    <p className="text-gray-600 text-xs">
                      {formData.brand || "Brand"}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="font-bold text-red-600 text-sm">
                        LKR{" "}
                        {formData.price
                          ? parseInt(formData.price).toLocaleString()
                          : "0"}
                      </span>
                      {formData.originalPrice &&
                        formData.originalPrice > formData.price && (
                          <span className="text-xs text-gray-400 line-through">
                            LKR{" "}
                            {parseInt(formData.originalPrice).toLocaleString()}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
