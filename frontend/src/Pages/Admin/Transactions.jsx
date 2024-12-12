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

const Payments = () => {
  const [payments, setPayments] = useState([]) // Renamed state variable for payments
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const navigate = useNavigate()

  // Fetch all payments
  const fetchPayments = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token') // Retrieve token for authorization

      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/payments`, // Changed endpoint to '/payments'
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
        }
      )

      setPayments(response.data)
    } catch (error) {
      if (error.response?.data?.message === 'Unauthorized! Invalid token.') {
        localStorage.clear()
        toast.error('Please login again')
        navigate('/login')
      } else {
        console.error('Error fetching payments:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  // Save edited payment status (if needed)
  const onRowEditSave = async (event) => {
    const { data } = event
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/payments/${data._id}`, // Updated endpoint
        {
          status: data.status, // Edit payment status
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === data._id ? response.data : payment
        )
      )
      toast.success('Payment status updated successfully')
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Failed to update payment status')
    }
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Payments</h1>

      {loading ? (
        <div className='flex w-full flex-col gap-4'>
          <div className='skeleton h-32 w-full'></div>
          <div className='skeleton h-4 w-28'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
        </div>
      ) : (
        <DataTable
          value={payments}
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
          <Column field='amount' header='Amount' sortable />
          <Column field='status' header='Status' sortable />
          <Column
            field='payment_url'
            header='Payment Link'
            sortable
            body={(rowData) => (
              <a
                href={rowData.payment_url}
                target='_blank'
                rel='noopener noreferrer'
              >
                {rowData.payment_url ? 'View Payment' : 'N/A'}
              </a>
            )}
          />
          {/* User Column: Full Name */}
          <Column
            field='userId.firstName'
            header='User'
            sortable
            body={(rowData) => (
              <span>
                {rowData.userId.firstName} {rowData.userId.lastName}
              </span>
            )}
          />
          {/* Email Column */}
          <Column
            field='userId.email'
            header='Email'
            sortable
            body={(rowData) => <span>{rowData.userId.email}</span>}
          />
          {/* Description Column */}
          <Column
            field='description'
            header='Description'
            sortable
            body={(rowData) => <span>{rowData.description}</span>}
          />
          {/* Remarks Column */}
          <Column
            field='remarks'
            header='Remarks'
            sortable
            body={(rowData) => <span>{rowData.remarks}</span>}
          />
          {/* Created At Column */}
          <Column
            field='createdAt'
            header='Created At'
            sortable
            body={dateTimeBodyTemplate}
          />
        </DataTable>
      )}
    </div>
  )
}

export default Payments
