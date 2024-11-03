import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { toast } from 'react-hot-toast'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const ProductTable = ({ isVisitor }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [viewImagesDialogVisible, setViewImagesDialogVisible] = useState(false)
  const [imagesLoading, setImagesLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    stock: '',
    price: '',
    address: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (product) => {
    setSelectedProduct(product)
    setFormData({
      title: product.title,
      caption: product.caption,
      stock: product.stock,
      price: product.price,
      address: product.address,
    })
    setDialogVisible(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const updateProduct = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/products/${
          selectedProduct._id
        }`,
        formData
      )
      fetchProducts()
      setDialogVisible(false)
      toast.success('Product updated successfully!')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product.')
    }
  }

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/products/${id}`
        )
        fetchProducts()
        toast.success('Product deleted successfully!')
      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error('Failed to delete product.')
      }
    }
  }

  const loadingTemplate = () => (
    <div className='grid grid-cols-1 gap-2 w-full'>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className='skeleton mt-3 rounded h-8 '></div>
      ))}
    </div>
  )

  const imageTemplate = (rowData) => (
    <div className='flex gap-2'>
      {rowData.images.map((image, index) => (
        <img
          key={index}
          src={`http://localhost:5000/${image}`}
          alt={`Product Image ${index + 1}`}
          className='h-20 w-20 object-cover'
        />
      ))}
    </div>
  )

  const viewImages = (images) => {
    setSelectedProduct(images)
    setViewImagesDialogVisible(true)
    setImagesLoading(true) // Start loading
    // Simulate an image load delay (remove if fetching actual data)
    setTimeout(() => {
      setImagesLoading(false) // Stop loading after images are "loaded"
    }, 1000)
  }

  return (
    <div className='p-4 shadow-2xl bg-white rounded-lg border'>
      {loading ? (
        <div>{loadingTemplate()}</div>
      ) : (
        <DataTable
          value={products}
          paginator
          rows={10}
          header='Product List'
          className='text-sm'
        >
          <Column field='title' header='Title' sortable />
          <Column field='caption' header='Caption' />
          <Column field='category' header='Category' />
          <Column field='stock' header='Stock' />
          <Column field='price' header='Price' />
          <Column field='address' header='Address' />
          <Column
            body={(rowData) => (
              <div className='flex gap-3'>
                <div
                  className='tooltip border py-1 rounded-lg border-main bg-main text-white shadow-lg'
                  data-tip='View Images'
                >
                  <Button
                    icon='pi pi-eye'
                    onClick={() => viewImages(rowData.images)}
                  />
                </div>
                <div
                  className='tooltip border py-1 rounded-lg border-main bg-main text-white shadow-lg'
                  data-tip='Edit'
                >
                  <Button
                    icon='pi pi-pencil'
                    onClick={() => openEditDialog(rowData)}
                    disabled={isVisitor}
                  />
                </div>
                <div
                  className='tooltip border py-1 rounded-lg border-main bg-main text-white shadow-lg'
                  data-tip='Delete'
                >
                  <Button
                    icon='pi pi-trash'
                    onClick={() => deleteProduct(rowData._id)}
                    disabled={isVisitor}
                  />
                </div>
              </div>
            )}
            header='Actions'
          />
        </DataTable>
      )}

      <Dialog
        header='Edit Product'
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        footer={
          <div className='flex items-center gap-3'>
            <Button
              label='Cancel'
              onClick={() => setDialogVisible(false)}
              className='py-1 px-2 rounded-lg border border-main  bg-transparent hover:bg-main hover:text-white text-black shadow-lg'
            />
            <Button
              label='Save'
              onClick={updateProduct}
              className='py-1 px-2 rounded-lg border-main bg-main text-white shadow-lg'
            />
          </div>
        }
      >
        <div>
          <label
            htmlFor='title'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Title
          </label>
          <input
            type='text'
            name='title'
            id='title'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor='caption'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Caption
          </label>
          <input
            type='text'
            name='caption'
            id='caption'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            value={formData.caption}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor='stock'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Stock
          </label>
          <input
            type='number'
            name='stock'
            id='stock'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            value={formData.stock}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor='price'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Price
          </label>
          <input
            type='number'
            name='price'
            id='price'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor='address'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Address
          </label>
          <input
            type='text'
            name='address'
            id='address'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
      </Dialog>

      <Dialog
        header='Product Images'
        visible={viewImagesDialogVisible}
        onHide={() => setViewImagesDialogVisible(false)}
        footer={
          <Button
            label='Close'
            onClick={() => setViewImagesDialogVisible(false)}
            className='py-1 px-2 rounded-lg border-main bg-main text-white shadow-lg'
          />
        }
      >
        {imagesLoading ? (
          <div className='flex gap-2'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className='skeleton h-40 w-40 rounded'></div>
            ))}
          </div>
        ) : (
          <div className='flex gap-2 flex-wrap'>
            {Array.isArray(selectedProduct) ? (
              selectedProduct.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image}`}
                  alt={`Product Image ${index + 1}`}
                  className='h-40 w-40 object-cover'
                />
              ))
            ) : (
              <img
                src={`http://localhost:5000/${selectedProduct}`}
                alt='Product Image'
                className='h-40 w-40 object-cover'
              />
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}

export default ProductTable
