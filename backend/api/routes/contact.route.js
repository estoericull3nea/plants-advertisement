import express from 'express'
import {
  createContact,
  getAllContacts,
  getContactById,
} from '../controllers/contact.controller.js'

const router = express.Router()

router.post('/', createContact)
router.get('/', getAllContacts)
router.get('/:contactId', getContactById)

export default router
