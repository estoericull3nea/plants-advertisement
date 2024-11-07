import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Products = () => {
  const [products, setProducts] = useState([]) // State for products
  const [loading, setLoading] = useState(true) // Loading state
  const [globalFilter, setGlobalFilter] = useState('') // State for global search
  const [selectedProduct, setSelectedProduct] = useState(null) // State for selected product for editing
  const [displayDialog, setDisplayDialog] = useState(false) // Dialog for updating product
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
      if (error.response?.data?.message === 'Unauthorized! Invalid token.') {
        toast.error('Please login again')
        localStorage.clear()
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle product deletion
  const deleteProduct = async (productId) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await axios.delete(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('Product deleted successfully')
      fetchProducts() // Reload the product list after deletion
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete product')
    }
  }

  // Handle product update (save after changes)
  const updateProduct = async () => {
    if (!selectedProduct) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const updatedProduct = await axios.put(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/products/${
          selectedProduct._id
        }`,
        selectedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('Product updated successfully')
      setDisplayDialog(false) // Close dialog
      fetchProducts() // Reload the product list after update
    } catch (error) {
      console.error(error)
      toast.error('Failed to update product')
    }
  }

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
          <Column
            header='Actions'
            body={(rowData) => (
              <div>
                <Button
                  icon='pi pi-pencil'
                  className='p-button-text'
                  onClick={() => handleEdit(rowData)}
                />
                <Button
                  icon='pi pi-trash'
                  className='p-button-text p-button-danger ml-2'
                  onClick={() => handleDelete(rowData._id)}
                />
              </div>
            )}
          />
        </DataTable>
      </div>
    )
  }

  // Handle edit button click
  const handleEdit = (product) => {
    setSelectedProduct({ ...product })
    setDisplayDialog(true)
  }

  // Handle delete button click
  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId)
    }
  }

  // Dialog for updating a product
  const renderDialog = () => {
    return (
      <Dialog
        visible={displayDialog}
        style={{ width: '450px' }}
        header='Update Product'
        modal
        onHide={() => setDisplayDialog(false)}
      >
        <div className='p-fluid'>
          <div className='form-control mb-4'>
            <label htmlFor='title' className='label'>
              <span className='label-text'>Title</span>
            </label>
            <input
              id='title'
              type='text'
              value={selectedProduct?.title}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  title: e.target.value,
                })
              }
              className='input input-bordered w-full'
              placeholder='Product Title'
            />
          </div>

          <div className='form-control mb-4'>
            <label htmlFor='category' className='label'>
              <span className='label-text'>Category</span>
            </label>
            <input
              id='category'
              type='text'
              value={selectedProduct?.category}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  category: e.target.value,
                })
              }
              className='input input-bordered w-full'
              placeholder='Product Category'
            />
          </div>

          <div className='form-control mb-4'>
            <label htmlFor='stock' className='label'>
              <span className='label-text'>Stock</span>
            </label>
            <input
              id='stock'
              type='number'
              value={selectedProduct?.stock}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  stock: e.target.value,
                })
              }
              className='input input-bordered w-full'
              placeholder='Product Stock'
            />
          </div>

          <div className='form-control mb-4'>
            <label htmlFor='price' className='label'>
              <span className='label-text'>Price</span>
            </label>
            <input
              id='price'
              type='number'
              value={selectedProduct?.price}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: e.target.value,
                })
              }
              className='input input-bordered w-full'
              placeholder='Product Price'
            />
          </div>

          <div className='form-control mb-4'>
            <label htmlFor='address' className='label'>
              <span className='label-text'>Address</span>
            </label>
            <input
              id='address'
              type='text'
              value={selectedProduct?.address}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  address: e.target.value,
                })
              }
              className='input input-bordered w-full'
              placeholder='Product Address'
            />
          </div>

          <div className='dialog-footer mt-4 flex justify-end gap-2'>
            <Button
              label='Cancel'
              icon='pi pi-times'
              className='p-button-text'
              onClick={() => setDisplayDialog(false)}
            />
            <Button
              label='Save'
              icon='pi pi-check'
              className='p-button-text'
              onClick={updateProduct}
            />
          </div>
        </div>
      </Dialog>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      {loading ? renderSkeleton() : renderDataTable()}
      {renderDialog()}
    </div>
  )
}

export default Products
