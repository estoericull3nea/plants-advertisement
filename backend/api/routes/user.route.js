import express from 'express'
import multer from 'multer'
import {
  addUser,
  deleteAllUsers,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/user.controller.js'

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

router.delete('/', deleteAllUsers)
router.post('/', addUser)
router.get('/', getAllUsers)
router.get('/:userId', getUserById)
router.delete('/:userId', deleteUserById)
router.put(
  '/:userId',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'validId', maxCount: 1 },
  ]),
  updateUserById
)

export default router
