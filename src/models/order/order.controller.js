// src/controllers/orderController.js

const HTTP_STATUS = require("../../utils/httpStatus");
const sendResponse = require("../../utils/responseHelper");
const { createOrderService, getAllOrdersService, getOrdersByUserService, updateOrderService } = require("./order.service");


const createOrder = async (req, res) => {
  try {
    const { userId, gigId, requirements } = req.body;

    // Call service to create an order
    const newOrder = await createOrderService(userId, gigId, requirements);

    sendResponse(res, HTTP_STATUS.CREATED, "Order created successfully", newOrder);
  } catch (error) {
    sendResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

const getOrders = async (req, res) => {
  try {
    // Call service to get all orders
    const orders = await getAllOrdersService();

    sendResponse(res, HTTP_STATUS.OK, "Orders fetched successfully", orders);
  } catch (error) {
    sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Call service to get orders by user
    const orders = await getOrdersByUserService(userId);

    sendResponse(res, HTTP_STATUS.OK, "User orders fetched successfully", orders);
  } catch (error) {
    sendResponse(res, HTTP_STATUS.NOT_FOUND, error.message);
  }
};

const updateOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
      const updates = req.body;
  
      const updatedOrder = await updateOrderService(orderId, updates);
      sendResponse(res, HTTP_STATUS.OK, "Order updated successfully", updatedOrder);
    } catch (error) {
      sendResponse(res, HTTP_STATUS.NOT_FOUND, error.message);
    }
  };


module.exports = {
  createOrder,
  getOrders,
  getOrdersByUser,
  updateOrder,

};
