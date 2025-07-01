"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiUpload,
  FiX,
  FiSave,
  FiEye,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiLoader,
} from "react-icons/fi";
import axiosInstance from "@/lib/axiosInstance";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const EditProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  // Fetch existing product data
  
  const {
    data: productData,
    error,
    isLoading,
    mutate,
  } = useSWR(`/getProductById/${params.id}`, fetcher);



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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImagePaths, setUploadedImagePaths] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [imagesToDelete, setImagesToDelete] = useState([]);

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

  // Populate form when product data is loaded
  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || "",
        brand: productData.brand || "",
        price: productData.price || "",
        originalPrice: productData.originalPrice || "",
        description: productData.description || "",
        stockCount: productData.stockCount || "",
        category: productData.category || "",
        badge: productData.badge || "",
        features:
          productData.features && productData.features.length > 0
            ? productData.features
            : [""],
      });

      if (productData.images) {
        setExistingImages(productData.images);
      }
    }
  }, [productData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const totalImages =
      existingImages.length + uploadedImagePaths.length + files.length;

    if (totalImages > 6) {
      alert("Maximum 6 images allowed");
      return;
    }

    for (const file of files) {
      const formData = new FormData();
      formData.append("images", file);

      try {
        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        setPreviewImages((prev) => [...prev, previewUrl]);

        // Start upload with progress
        const res = await axiosInstance.post("/upload", formData, {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({ ...prev, [file.name]: percent }));
          },
        });

        // Handle success
        const uploadedPath = res.data.files[0];
        setUploadedImagePaths((prev) => [...prev, uploadedPath]);
        setUploadStatus((prev) => ({ ...prev, [file.name]: "success" }));
      } catch (error) {
        console.error("Image upload failed:", error);
        setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
        alert(`Upload failed for ${file.name}`);
      }
    }
  };

  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setImagesToDelete((prev) => [...prev, imageToRemove]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    const newUploaded = uploadedImagePaths.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);
    setUploadedImagePaths(newUploaded);
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

    try {
      // Combine existing images (minus deleted ones) with new uploaded images
      const allImages = [...existingImages, ...uploadedImagePaths];

      const updateData = {
        ...formData,
        images: allImages,
        imagesToDelete: imagesToDelete,
      };

      const res = await axiosInstance.put(
        `/updateProduct/${productId}`,
        updateData
      );

      if (res.status === 200) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Link href="/admin/products">
            <Button className="bg-red-600 hover:bg-red-700">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
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
            <div className="flex items-center space-x-4">
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  <FiArrowLeft className="w-4 h-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Product
                </h1>
                <p className="text-gray-600">Update product information</p>
              </div>
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
                {isSubmitting ? "Updating..." : "Update Product"}
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

          {/* Image Management */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Product Images</h2>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Current Images
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square relative rounded-lg overflow-hidden">
                            <Image
                              src={`http://localhost:3001${image}`}
                              alt={`Current ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeExistingImage(index)}
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
                  </div>
                )}

                {/* Upload New Images */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleNewImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload new images
                    </p>
                  </label>
                </div>

                {/* New Image Previews */}
                {previewImages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      New Images
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square relative rounded-lg overflow-hidden">
                            <Image
                              src={preview}
                              alt={`New ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            size="sm"
                          >
                            <FiX className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
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
                    {existingImages[0] ? (
                      <Image
                        src={`http://localhost:3001${existingImages[0]}`}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="object-cover rounded-lg"
                      />
                    ) : previewImages[0] ? (
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

export default EditProductPage;
