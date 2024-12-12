import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'tailwindcss/tailwind.css'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { dateTimeBodyTemplate } from '../../utils/formatDateWIthTime'

const Chats = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const navigate = useNavigate()

  // Fetch messages between logged-in user and selected user
  const fetchMessages = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token') // Retrieve token for authorization

      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/chats/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
        }
      )
      setMessages(response.data)
      console.log(response.data)
    } catch (error) {
      if (error.response?.data?.message === 'Unauthorized! Invalid token.') {
        localStorage.clear()
        toast.error('Please login again')
        navigate('/login')
      } else {
        console.error('Error fetching messages:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  // Save edited message
  const onRowEditSave = async (event) => {
    const { data } = event
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/messages/${data._id}`,
        {
          text: data.text,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg._id === data._id ? response.data : msg))
      )
      toast.success('Message updated successfully')
    } catch (error) {
      console.error('Error updating message:', error)
      toast.error('Failed to update message')
    }
  }

  // Delete a message
  // const deleteMessage = async (id) => {
  //   setLoading(true)
  //   try {
  //     await axios.delete(
  //       `${import.meta.env.VITE_DEV_BACKEND_URL}/chats/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     )
  //     setMessages((prevMessages) =>
  //       prevMessages.filter((msg) => msg._id !== id)
  //     )
  //     toast.success('Message deleted successfully')
  //   } catch (error) {
  //     console.error('Error deleting message:', error)
  //     toast.error('Failed to delete message')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Action Template for editing and deleting
  // const actionBodyTemplate = (rowData) => {
  //   return (
  //     <div className='flex gap-2'>
  //       <button
  //         className='btn btn-error btn-xs'
  //         onClick={() => deleteMessage(rowData._id)}
  //       >
  //         Delete
  //       </button>
  //     </div>
  //   )
  // }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Chats</h1>

      {loading ? (
        <div className='flex w-full flex-col gap-4'>
          <div className='skeleton h-32 w-full'></div>
          <div className='skeleton h-4 w-28'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
        </div>
      ) : (
        <DataTable
          value={messages}
          paginator
          rows={10}
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
          onRowEditComplete={onRowEditSave}
        >
          <Column
            field='text'
            header='Message'
            sortable
            editor={(options) => (
              <input
                type='text'
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
                className='p-inputtext p-component'
              />
            )}
          />
          <Column field='senderId.firstName' header='Sender' sortable />
          <Column field='receiverId.firstName' header='Receiver' sortable />
          <Column
            field='createdAt'
            header='Send Time'
            sortable
            body={dateTimeBodyTemplate}
          />
          {/* <Column body={actionBodyTemplate} header='Actions' /> */}
        </DataTable>
      )}
    </div>
  )
}

export default Chats
