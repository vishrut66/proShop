import express from 'express'
const router = express.Router()
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    getUserById,
    updateUser,
} from '../controller/userController.js'


import { protect, admin } from "../middleware/authMiddleware.js";

router.route('/').post(registerUser)
    .get(protect, admin, getAllUsers,)


router.post('/login', authUser)



router
    .route('/profile')
    .get(protect, getUserProfile)
    .patch(protect, updateUserProfile)

router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .patch(protect, admin, updateUser)

export default router
