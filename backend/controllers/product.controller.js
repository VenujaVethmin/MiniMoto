import { PrismaClient } from "../src/generated/prisma/client.js"; 

const prisma = new PrismaClient();




export const homePage = async (req, res) => {
  try {
    const data = await prisma.product.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc', // Order by creation date, most recent first
      }
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ msg: error.message });
  }
};



export const getAllProduct = async (req, res) => {
  try {
    const data = await prisma.product.findMany()

    return res.status(200).json(data)
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ msg: error.message });
    
  }
}

export const getProductById = async (req, res) => {
  try {
    const data = await prisma.product.findUnique({
      where:{
        id : req.params.id
      }
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ msg: error.message });
  }
};





export const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      originalPrice,
      description,
      stockCount,
      category,
      badge,
      features,   // Expecting an array: ["feature1", "feature2"]
      images,     // Expecting an array: ["url1", "url2"]
            // ID of the user adding the product
    } = req.body;

    // Optional: Validate required fields
    if (!name || !brand || !price || !originalPrice || !description || !stockCount || !category ) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        brand,
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice),
        description,
        stockCount: parseInt(stockCount),
        category,
        badge: badge || null, // Optional field
        features: features || [], // Default to empty array if not provided
        images: images || [], // Default to empty array if not provided
      },
    });
    res.status(201).json({ msg: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ msg: error.message });
    
  }
}



export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      brand,
      price,
      originalPrice,
      description,
      stockCount,
      category,
      badge,
      features,
      images,
      imagesToDelete, // Array of image paths to delete
    } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Validate required fields
    if (!name || !brand || !price || !description || !stockCount || !category) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Handle image deletion if specified
    let updatedImages = existingProduct.images || [];
    if (imagesToDelete && imagesToDelete.length > 0) {
      // Remove deleted images from the array
      updatedImages = updatedImages.filter(
        (img) => !imagesToDelete.includes(img)
      );

      // Optional: Delete physical files from server
      // You can implement file deletion logic here if needed
      // imagesToDelete.forEach(imagePath => {
      //   const fullPath = path.join(__dirname, '../../uploads', imagePath);
      //   if (fs.existsSync(fullPath)) {
      //     fs.unlinkSync(fullPath);
      //   }
      // });
    }

    // Add new images to the existing ones
    if (images && images.length > 0) {
      updatedImages = [...updatedImages, ...images];
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        brand,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        description,
        stockCount: parseInt(stockCount),
        category,
        badge: badge || null,
        features: features || [],
        images: updatedImages,
        updatedAt: new Date(), // Optional: explicitly set update timestamp
      },
    });

    res.status(200).json({
      msg: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ msg: error.message });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const data = await prisma.product.delete({
      where: {
        id: req.params.id
      }
   
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ msg: error.message });
  }
};
