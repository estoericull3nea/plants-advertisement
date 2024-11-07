import express from 'express'
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../controllers/contact.controller.js'

const router = express.Router()

router.post('/', createContact)
router.get('/', getAllContacts)
router.get('/:contactId', getContactById)
router.delete('/:id', deleteContact)
router.patch('/:id', updateContact)

export default router
