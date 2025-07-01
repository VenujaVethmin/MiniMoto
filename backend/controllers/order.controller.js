import { PrismaClient, Prisma } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

export const placeOrder = async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    province,
    postalCode,
    email,
    phone,
    
    
    
    additionalNotes,
  
    products, // array of product IDs
  } = req.body;

  try {
    // 💡 Validate that products is an array of strings
    if (
      !Array.isArray(products) ||
      products.some((p) => typeof p !== "string")
    ) {
      return res.status(400).json({ msg: "Invalid product IDs array" });
    }

    // ✅ Get product prices
    const productDetails = await prisma.product.findMany({
      where: {
        id: {
          in: products,
        },
      },
    });

    if (productDetails.length !== products.length) {
      return res.status(400).json({ msg: "Some product IDs are invalid" });
    }

    // ✅ Calculate subtotal from product prices
    const subtotal = productDetails.reduce(
      (acc, product) => acc + product.price,
      0
    );
    const shipping = 550; // You can calculate this dynamically if needed
    const total = subtotal + shipping;

    const data = await prisma.order.create({
      data: {
        firstName,
        lastName,
        address,
        city,
        province,
        postalCode,
        email,
        phone,
        additionalNotes,

        subtotal: new Prisma.Decimal(subtotal),
        shippingCost: new Prisma.Decimal(shipping),
        total: new Prisma.Decimal(total),

        products: {
          connect: products.map((id) => ({ id })), // ✅ this is the fix!
        },
      },
      include: {
        products: true,
      },
    });

    return res.status(201).json({
      msg: "Order placed successfully",
      order: data,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ msg: error.message });
  }
};




export const getAllOrders = async (req, res) => {
  try {
    const data = await prisma.order.findMany({
      where:{
        orderStatus: {
          not: 'DELIVERED', // Exclude cancelled orders
        },
      }
      ,
    
      orderBy: {
        createdAt: 'asc', // Order by creation date, most recent first
      },
      include:{
        products: true, // Include related products
      }
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ msg: error.message });
  }
};




export const updateOrderStatus = async (req, res) => {
  try {
    const data = await prisma.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        orderStatus: req.body.orderStatus, // Assuming status is passed in the request body
      },
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ msg: error.message });
  }
};

