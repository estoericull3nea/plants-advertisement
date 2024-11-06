// routes/likeRoutes.js
import express from 'express'
import { getPlants, mockData } from '../controllers/plantCalendar.controller.js'

const router = express.Router()

router.post('/mock-data', mockData)
router.get('/', getPlants)

export default router
