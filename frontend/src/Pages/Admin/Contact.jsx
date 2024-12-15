// src/components/Contact.js

import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'tailwindcss/tailwind.css'

const Contact = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')

  // Fetch all contacts
  const fetchContacts = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/contacts`
      )
      setContacts(response.data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  // Update contact status
  const updateContact = async (id, status) => {
    setLoading(true)
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/contacts/${id}`,
        { status }
      )
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === id ? response.data : contact
        )
      )
      toast.success('Contact status updated')
    } catch (error) {
      console.error('Error updating contact:', error)
      toast.error('Failed to update contact')
    } finally {
      setLoading(false)
    }
  }

  // Delete a contact
  // const deleteContact = async (id) => {
  //   setLoading(true)
  //   try {
  //     await axios.delete(
  //       `${import.meta.env.VITE_DEV_BACKEND_URL}/contacts/${id}`
  //     )
  //     setContacts((prevContacts) =>
  //       prevContacts.filter((contact) => contact._id !== id)
  //     )
  //     toast.success('Contact deleted successfully')
  //   } catch (error) {
  //     console.error('Error deleting contact:', error)
  //     toast.error('Failed to delete contact')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Date formatting function
  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.createdAt).toLocaleString()
  }

  // Status editor dropdown
  const statusEditor = (options) => {
    return (
      <select
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        className='p-inputtext p-component'
      >
        <option value='pending'>Pending</option>
        <option value='responded'>Responded</option>
        <option value='resolved'>Resolved</option>
      </select>
    )
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Contacts</h1>

      {loading ? (
        <div className='flex w-full flex-col gap-4'>
          <div className='skeleton h-32 w-full'></div>
          <div className='skeleton h-4 w-28'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
        </div>
      ) : (
        <DataTable
          value={contacts}
          paginator
          rows={20}
          header={
            <div className='flex justify-between items-center'>
              <span className='p-input-icon-left'>
                <i className='pi pi-search' />
                <input
                  type='text'
                  className='p-inputtext p-component'
                  placeholder='Global Search'
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </span>
            </div>
          }
          globalFilter={globalFilter}
          editable
        >
          <Column field='firstName' header='First Name' sortable />
          <Column field='lastName' header='Last Name' sortable />
          <Column field='email' header='Email' sortable />
          <Column field='message' header='Message' sortable />
          <Column
            field='status'
            header='Status'
            sortable
            editor={(options) => statusEditor(options)} // Inline editing for status
            onCellEditComplete={(e) => updateContact(e.rowData._id, e.newValue)}
          />
          <Column
            field='createdAt'
            header='Send Time'
            sortable
            body={dateBodyTemplate} // Date and time formatting
          />
          {/* <Column
            header='Actions'
            body={(rowData) => (
              <div className='flex gap-2'>
                <button
                  className='btn btn-error btn-xs'
                  onClick={() => deleteContact(rowData._id)}
                >
                  Delete
                </button>
              </div>
            )}
          /> */}
        </DataTable>
      )}
    </div>
  )
}

export default Contact
