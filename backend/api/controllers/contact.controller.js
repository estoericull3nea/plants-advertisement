import Contact from '../models/contact.model.js'

export const createContact = async (req, res) => {
  const { firstName, lastName, email, message } = req.body

  const newContact = new Contact({
    firstName,
    lastName,
    email,
    message,
  })

  const savedContact = await newContact.save()

  res.status(201).json(savedContact)
}

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 })
  res.status(200).json(contacts)
}

export const getContactById = async (req, res) => {
  const { contactId } = req.params

  const contact = await Contact.findById(contactId)
  if (!contact) {
    return res.status(404).json({ message: 'Contact form not found' })
  }
  res.status(200).json(contact)
}
