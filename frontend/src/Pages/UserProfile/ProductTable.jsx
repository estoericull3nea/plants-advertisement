import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const ProductTable = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [dialogVisible, setDialogVisible] = useState(false)
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
        `${import.meta.env.VITE_DEV_BACKEND_URL}/products`
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
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/products/${id}`
        )
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const loadingTemplate = () => (
    <div className='flex w-52 flex-col gap-4'>
      <div className='skeleton h-32 w-full'></div>
      <div className='skeleton h-4 w-28'></div>
      <div className='skeleton h-4 w-full'></div>
      <div className='skeleton h-4 w-full'></div>
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

  return (
    <div className='p-4'>
      {loading ? (
        <div className='flex flex-wrap gap-4'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='flex flex-col gap-4'>
              {loadingTemplate()}
            </div>
          ))}
        </div>
      ) : (
        <DataTable value={products} paginator rows={10} header='Product List'>
          <Column field='title' header='Title' sortable />
          <Column field='caption' header='Caption' />
          <Column field='category' header='Category' />
          <Column field='stock' header='Stock' />
          <Column field='price' header='Price' />
          <Column field='address' header='Address' />
          <Column body={imageTemplate} header='Images' />
          <Column
            body={(rowData) => (
              <div>
                <Button
                  label='Edit'
                  icon='pi pi-pencil'
                  onClick={() => openEditDialog(rowData)}
                />
                <Button
                  label='Delete'
                  icon='pi pi-trash'
                  className='ml-2'
                  onClick={() => deleteProduct(rowData._id)}
                />
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
          <div>
            <Button label='Cancel' onClick={() => setDialogVisible(false)} />
            <Button label='Save' onClick={updateProduct} />
          </div>
        }
      >
        <div className='field'>
          <label htmlFor='title'>Title</label>
          <InputText
            id='title'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        <div className='field'>
          <label htmlFor='caption'>Caption</label>
          <InputText
            id='caption'
            name='caption'
            value={formData.caption}
            onChange={handleInputChange}
          />
        </div>
        <div className='field'>
          <label htmlFor='stock'>Stock</label>
          <InputText
            id='stock'
            name='stock'
            value={formData.stock}
            onChange={handleInputChange}
          />
        </div>
        <div className='field'>
          <label htmlFor='price'>Price</label>
          <InputText
            id='price'
            name='price'
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>
        <div className='field'>
          <label htmlFor='address'>Address</label>
          <InputText
            id='address'
            name='address'
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
      </Dialog>
    </div>
  )
}

export default ProductTable
