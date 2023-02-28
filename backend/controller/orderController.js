import mongoose from "mongoose";
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import Order from "../models/orderModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = catchAsync(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body


    if (orderItems && orderItems.length === 0) {
        return next(new AppError("No order item", 404))
    }

    const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)

})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    )

    if (!order) {
        return next(new AppError("order not Found!!"), 404)
    }

    res.status(200).json(order)

})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new AppError("order not Found!!"), 404)
    }


    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.status(200).json(updatedOrder);

})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new AppError("order not Found!!"), 404)

    }

    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.status(200).json(updatedOrder)

})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = catchAsync(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
})


// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({}).populate('user', 'id name')

    if (!orders) {
        return next(new AppError("orders not found"), 404);
    }

    res.status(200).json(orders)
})



export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
}