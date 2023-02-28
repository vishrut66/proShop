import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";
import User from '../models/userModel.js'



// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError("Invalide values"), 400);
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new AppError("there is no user with this email"), 404);
    }

    const MP = await user.matchPassword(password);

    if (!MP) {
        return next(new AppError("Invalid email or password"), 401);
    }

    const token = generateToken(user._id)

    user.password = undefined;
    res.status(200).json({
        status: 'success',
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token

    })

    // if (user && (await user.matchPassword(password))) {
    //   res.json({
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     isAdmin: user.isAdmin,
    //     token: generateToken(user._id),
    //   })
    // } else {
    //   res.status(401)
    //   throw new Error('Invalid email or password')
    // }
})


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body

    if (!email || !password) {
        return next(new AppError("please enter all values"), 400)
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        return next(new AppError("User already exists"), 400);
    }

    const user = await User.create({
        name,
        email,
        password,
    })

    if (!user) {
        return next(new AppError("Invalid user data"), 400);
    }


    const token = generateToken(user._id)

    res.status(201).json({
        status: 'success',
        user,
        token
    })

})


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = catchAsync(async (req, res, next) => {


    if (!req.user._id) {
        return next(new AppError("please enter valide userId"), 404)
    }

    const user = await User.findById(req.user._id)

    if (!user) {
        return next(new AppError("User not found"), 404)
    }

    res.status(200).json({
        status: 'success',
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    })
})


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = catchAsync(async (req, res, next) => {

    if (!req.user) {
        return next(new AppError("Authentication failed!!"), 401)
    }

    const user = await User.findById(req.user._id)

    if (!user) {
        return next(new AppError('User not found'), 404)
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
        user.password = req.body.password
    }

    const updatedUser = await user.save()

    const token = generateToken(updatedUser._id)

    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token
    })


})


// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new AppError('User not found'), 404)
    }

    await user.remove()
    res.json({ msg: 'User removed' })

})


// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError('User not found'), 404)
    }


    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
    })

})




const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    if (!users) {
        return next(new AppError("ther is no yours"), 400);
    }

    res.status(200).json({
        status: "success",
        totalUsers: users.length,
        users
    })
})

const getUserById = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id)
    // .select('-password')

    if (!user) {
        return next(new AppError("there is no user with this id"), 400)
    }

    res.status(200).json(user)

})

export { authUser, registerUser, getUserById, getAllUsers, getUserProfile, updateUserProfile, deleteUser, updateUser }