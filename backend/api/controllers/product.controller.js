import imageKit from '../imagekit.js'
import Product from '../models/product.model.js'
import User from '../models/user.model.js'

export const createProduct = async (req, res) => {
  try {
    const { title, caption, category, stock, price, address, packaging } =
      req.body
    const images = req.files

    // Upload images to ImageKit
    const uploadPromises = images.map((file) => {
      return new Promise((resolve, reject) => {
        imageKit.upload(
          {
            file: file.buffer, // Pass file buffer to ImageKit
            fileName: file.originalname, // Set the file name
            tags: ['product'], // Optional: You can add tags for the uploaded images
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result.url) // Resolve the ImageKit URL for the uploaded image
            }
          }
        )
      })
    })

    // Wait for all image uploads to finish
    const imageUrls = await Promise.all(uploadPromises)

    // Create a new product
    const newProduct = new Product({
      title,
      caption,
      category,
      stock,
      price,
      images: imageUrls, // Save ImageKit URLs
      userId: req.user, // Assuming user ID is set in the request
      address,
      packaging,
    })

    // Save the product to the database
    const savedProduct = await newProduct.save()

    // Respond with the created product
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

  const productSearchResults = await Product.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { caption: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
      { address: { $regex: query, $options: 'i' } },
    ],
  }).populate('userId')

  const userSearchResults = await User.find({
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
  })

  const userIds = userSearchResults.map((user) => user._id)

  const userProducts = await Product.find({
    userId: { $in: userIds },
  }).populate('userId')

  const allProducts = [...productSearchResults, ...userProducts]

  if (!allProducts.length) {
    return res.status(404).json({ message: 'Product not found' })
  }

  res.status(200).json(allProducts)
}

export const getProductCount = async (req, res) => {
  const { userId } = req.params

  const count = await Product.countDocuments({ userId })
  res.status(200).json({ count })
}

export const getProductsByUserId = async (req, res) => {
  const { userId } = req.params

  const products = await Product.find({ userId }).populate(
    'userId',
    '-password'
  )
  if (!products.length) {
    return res.status(404).json({ message: 'No products found for this user.' })
  }
  res.json(products)
}
