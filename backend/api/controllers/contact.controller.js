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

export const deleteContact = async (req, res) => {
  const { id } = req.params
  const deletedContact = await Contact.findByIdAndDelete(id)

  if (!deletedContact) {
    return res.status(404).json({ error: 'Contact not found' })
  }

  return res.status(200).json({ message: 'Contact deleted successfully' })
}

export const updateContact = async (req, res) => {
  const { id } = req.params
  const updates = req.body

  const updatedContact = await Contact.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  })

  if (!updatedContact) {
    return res.status(404).json({ error: 'Contact not found' })
  }

  return res.status(200).json(updatedContact)
}
