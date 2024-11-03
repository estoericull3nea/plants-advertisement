import Product from '../models/product.model.js'
import User from '../models/user.model.js'

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
  const product = await Product.findById(req.params.id).populate(
    'userId',
    '-password'
  )
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

export const getRelatedProducts = async (req, res) => {
  const { categoryId, productId } = req.params

  const products = await Product.find({
    category: categoryId,
    _id: { $ne: productId },
  }).limit(4)

  res.json(products)
}

export const searchProducts = async (req, res) => {
  const { query } = req.query

  // Search for products by title, caption, category, or address
  const productSearchResults = await Product.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { caption: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
      { address: { $regex: query, $options: 'i' } },
    ],
  }).populate('userId', 'firstName lastName email')

  // Search for users by firstName, lastName, or email
  const userSearchResults = await User.find({
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
  })

  // Extract user IDs from the matched users
  const userIds = userSearchResults.map((user) => user._id)

  // Search for products posted by the matched users
  const userProducts = await Product.find({
    userId: { $in: userIds },
  }).populate('userId', 'firstName lastName email')

  // Combine the results from both searches
  const allProducts = [...productSearchResults, ...userProducts]

  if (!allProducts.length) {
    return res.status(404).json({ message: 'Product not found' })
  }

  res.status(200).json(allProducts)
}
