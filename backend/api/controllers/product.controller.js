import Product from '../models/product.model.js'

export const createProduct = async (req, res) => {
  const { title, caption, category, stock, price, images, quantity, address } =
    req.body

  const newProduct = new Product({
    title,
    caption,
    category,
    stock,
    price,
    images,
    quantity,
    userId: req.user,
    address,
  })

  try {
    const savedProduct = await newProduct.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'username')
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
