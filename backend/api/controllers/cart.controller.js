import Cart from '../models/cartItem.model.js'
import Product from '../models/product.model.js'

export const addToCart = async (req, res) => {
  const { productId, userId, quantity } = req.body

  const product = await Product.findById(productId)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: 'Not enough stock available' })
  }

  let cartItem = await Cart.findOne({ productId, userId })

  if (cartItem) {
    const newQ = cartItem.quantity + quantity
    console.log('comming q:', quantity)
    console.log('new q:', newQ)
    console.log('prev q:', cartItem.quantity)

    cartItem.quantity = newQ

    await cartItem.save()
  } else {
    cartItem = new Cart({ productId, userId, quantity })
    await cartItem.save()
  }

  product.stock -= quantity
  await product.save()

  res.status(200).json({ message: 'Item added to cart', cartItem })
}

export const updateCartItem = async (req, res) => {
  const { id } = req.params
  const { quantity } = req.body

  const cartItem = await Cart.findByIdAndUpdate(id, { quantity }, { new: true })

  if (!cartItem) {
    return res.status(404).json({ message: 'Cart item not found' })
  }

  res.status(200).json(cartItem)
}

export const deleteCartItem = async (req, res) => {
  const { id } = req.params

  const cartItem = await Cart.findByIdAndDelete(id)
  if (!cartItem) {
    return res.status(404).json({ message: 'Cart item not found' })
  }

  res.status(204).json()
}

export const getCartItems = async (req, res) => {
  const { userId } = req.params
  const cartItems = await Cart.find({ userId })
    .populate('productId')
    .populate('userId')
  res.status(200).json(cartItems)
}
