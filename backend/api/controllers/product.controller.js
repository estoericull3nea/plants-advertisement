import Product from '../models/product.model.js'

export const createProduct = async (req, res) => {
  try {
    const { title, caption, category, stock, price, address } = req.body

    const images = req.files.map((file) => file.path)

    const newProduct = new Product({
      title,
      caption,
      category,
      stock,
      price,
      images,
      userId: req.user,
      address,
    })

    const savedProduct = await newProduct.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error creating product', error: error.message })
  }
}

export const getAllProducts = async (req, res) => {
  const products = await Product.find().populate('userId', '-password')
  res.json(products)
}

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.status(200).json(product)
}

export const updateProduct = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
  if (!updatedProduct) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.status(200).json(updatedProduct)
}

export const deleteProduct = async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id)
  if (!deletedProduct) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.status(204).json()
}
