import Product from '../models/product.model.js'

export const createProduct = async (req, res) => {
  try {
    const { title, caption, category, stock, price, address } = req.body

    // Handle images
    const images = req.files.map((file) => file.path) // Get paths of uploaded images

    const newProduct = new Product({
      title,
      caption,
      category,
      stock,
      price,
      images,
      userId: req.user, // Adjust based on how you store user ID
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
