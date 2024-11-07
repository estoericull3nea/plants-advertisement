import express from 'express'
import { countUsers } from '../controllers/data.controller.js'

const router = express.Router()

router.get('/count-users', countUsers)
export default router
