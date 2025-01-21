// src/services/orderService.js
const Order = require("./order.model");

const createOrderService = async (userId, gigId, requirements) => {
  // Check if required fields are missing
  if (!userId || !gigId || !requirements) {
    throw new Error("All fields are required: user_id, gig_id, and requirements");
  }

  // Create and save the new order
  const newOrder = new Order({
    userId,
    gigId,
    requirements,
  });

  await newOrder.save();
  return newOrder;
};

const getAllOrdersService = async () => {
  const orders = await Order.find()
    .populate("userId", "name email") // Populate user info
    .populate("gigId", "title description"); // Populate gig info
  return orders;
};

const getOrdersByUserService = async (userId) => {
  const orders = await Order.find({ userId: userId }).populate("gigId", "title description");
  if (orders.length === 0) {
    throw new Error("No orders found for this user");
  }
  return orders;
};


const updateOrderService = async (orderId, updates) => {
  try {
    // Check if updates are provided
    if (Object.keys(updates).length === 0) {
      throw new Error('No updates provided');
    }

    // Find the order by ID and return an error if not found
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Update the order with only the fields provided in 'updates'
    // Using the $set operator ensures that only the provided fields are updated
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updates },
      { new: true } // `new: true` returns the updated document
    );

    // Return the updated order
    return updatedOrder;
  } catch (error) {
    // Handle error gracefully
    throw new Error(`Error updating order: ${error.message}`);
  }
};


module.exports = {
  createOrderService,
  getAllOrdersService,
  getOrdersByUserService,
  updateOrderService,
  // updateOrderStatusService
};

