import mongoose from "mongoose";
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import Product from "../models/productModel.js"


const getProducts = catchAsync(async (req, res, next) => {
    const pageSize = 8
    const page = Number(req.query.pageNumber) || 1


    const count = await Product.countDocuments()
    const products = await Product.find().limit(pageSize)
        .skip(pageSize * (page - 1))


    if (!products) {
        return next(new AppError("there is no products found", 404))
    }

    res.status(200).json({
        products, page, pages: Math.ceil(count / pageSize)
    })

})


const getProductById = catchAsync(async (req, res, next) => {

    const prod = await Product.findById(req.params.id)

    if (!prod) {
        return next(new AppError("there is no found with this id", 404))
    }

    res.status(200).json({
        status: 'success',
        product: prod
    })
})

const createProduct = catchAsync(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    })

    const createdProduct = await product.save()

    res.status(201).json(createdProduct)
})


const updateProduct = catchAsync(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new AppError("products not found", 404))
    }

    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()

    res.status(203).json(updatedProduct)

})

const deletProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new AppError('Product not found', 404))
    }

    await product.remove()

    res.json({ message: 'Product removed' })

})



// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = catchAsync(async (req, res, next) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new AppError('Product not found', 404))
    }


    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    )



    if (alreadyReviewed) {
        return next(new AppError('Product already reviewed', 400))
    }

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })

})


export { getProducts, getProductById, createProduct, updateProduct, deletProduct, createProductReview } 