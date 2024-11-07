import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Products = () => {
  const [products, setProducts] = useState([]) // State for products
  const [loading, setLoading] = useState(true) // Loading state
  const [globalFilter, setGlobalFilter] = useState('') // State for global search
  const navigate = useNavigate()

  // Fetch all products from the backend with Bearer token
  const fetchProducts = async () => {
    const token = localStorage.getItem('token') // or retrieve token from context, cookies, etc.

    if (!token) {
      console.error('No token found for authentication')
      return
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token in Authorization header
          },
        }
      )
      setProducts(response.data)
      console.log(response.data)
      setLoading(false) // Stop loading once data is fetched
    } catch (error) {
      if (error.response.data.message === 'Unauthorized! Invalid token.') {
        toast.error('Please login again')
        localStorage.clear()
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Render skeleton loader while loading
  const renderSkeleton = () => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='skeleton h-32 w-full'></div>
        <div className='skeleton h-4 w-28'></div>
        <div className='skeleton h-4 w-full'></div>
        <div className='skeleton h-4 w-full'></div>
      </div>
    )
  }

  // Render DataTable when data is loaded
  const renderDataTable = () => {
    return (
      <div className='card'>
        <span className='text-2xl font-semibold'>Product List</span>
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder='Search...'
          className='mb-4 p-inputtext-sm'
        />
        <DataTable
          value={products}
          paginator
          rows={10}
          globalFilter={globalFilter}
          emptyMessage='No products found'
          className='shadow-2xl'
        >
          <Column field='title' header='Title' sortable />
          <Column field='category' header='Category' sortable />
          <Column field='stock' header='Stock' sortable />
          <Column field='price' header='Price' sortable />
          <Column field='address' header='Address' sortable />
          <Column
            field='isAvailable'
            header='Available'
            sortable
            body={(rowData) => (rowData.isAvailable ? 'Yes' : 'No')}
          />
        </DataTable>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      {loading ? renderSkeleton() : renderDataTable()}
    </div>
  )
}

export default Products
