import Cart from '../models/cartItem.model.js'
import Product from '../models/product.model.js'

// export const addToCart = async (req, res) => {
//   const { productId, userId, quantity } = req.body

//   const product = await Product.findById(productId)
//   if (!product) {
//     return res.status(404).json({ message: 'Product not found' })
//   }

//   if (product.stock < quantity) {
//     return res.status(400).json({ message: 'Not enough stock available' })
//   }

//   let cartItem = await Cart.findOne({ productId, userId })

//   if (cartItem) {
//     const newQuantity = cartItem.quantity + parseInt(quantity)

//     if (product.stock < newQuantity) {
//       return res.status(400).json({
//         message: 'Not enough stock available for the updated quantity',
//       })
//     }

//     cartItem.quantity = newQuantity
//     cartItem.total = product.price * newQuantity
//     await cartItem.save()
//   } else {
//     cartItem = new Cart({
//       productId,
//       userId,
//       quantity: parseInt(quantity),
//       total: product.price * quantity,
//     })
//     await cartItem.save()
//   }

//   product.stock -= quantity
//   await product.save()

//   res.status(200).json({ message: 'Item added to cart', cartItem })
// }

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
    const newQuantity = cartItem.quantity + parseInt(quantity)

    if (product.stock < newQuantity) {
      return res.status(400).json({
        message: 'Not enough stock available for the updated quantity',
      })
    }

    cartItem.quantity = newQuantity
    cartItem.total = product.price * newQuantity
    await cartItem.save()
  } else {
    cartItem = new Cart({
      productId,
      userId,
      quantity: parseInt(quantity),
      total: product.price * quantity,
    })
    await cartItem.save()
  }

  // product.stock -= quantity
  // await product.save()

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

  try {
    // Get all cart items for the user, populating productId and userId
    const cartItems = await Cart.find({ userId }).populate('productId')

    // Filter out cart items where productId is null and delete them from the database
    const cartItemsToDelete = cartItems.filter((item) => !item.productId)

    if (cartItemsToDelete.length > 0) {
      // Delete cart items with null productId
      const cartItemIdsToDelete = cartItemsToDelete.map((item) => item._id)
      await Cart.deleteMany({ _id: { $in: cartItemIdsToDelete } })
    }

    // Get the updated list of cart items
    const updatedCartItems = await Cart.find({ userId }).populate({
      path: 'productId',
      populate: {
        path: 'userId',
        model: 'User',
      },
    })

    // Return the updated cart items
    res.status(200).json(updatedCartItems)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching cart items' })
  }
}

export const getCartCount = async (req, res) => {
  const { userId } = req.params

  const count = await Cart.countDocuments({ userId })
  res.status(200).json({ count })
}

export const updateCartItemQuantity = async (req, res) => {
  const { userId } = req.params
  const { productId, quantity } = req.body

  const cartItem = await Cart.findOne({ userId, productId })

  if (!cartItem) {
    return res.status(404).json({ message: 'Cart item not found' })
  }

  const product = await Product.findById(productId)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  if (quantity > product.stock) {
    return res
      .status(400)
      .json({ message: 'Requested quantity exceeds available stock' })
  }

  const quantityDifference = quantity - cartItem.quantity

  if (quantityDifference > product.stock) {
    return res.status(400).json({ message: 'Requested quantity exceeds stock' })
  }

  cartItem.quantity = quantity
  cartItem.total = product.price * quantity

  product.stock -= quantityDifference
  await product.save()

  await cartItem.save()

  return res.status(200).json(cartItem)
}

export const deleteSelectedItems = async (req, res) => {
  const { userId, cartIds } = req.body

  if (!userId || !Array.isArray(cartIds) || cartIds.length === 0) {
    return res.status(400).json({ message: 'Invalid request data' })
  }

  const result = await Cart.deleteMany({
    userId: userId,
    _id: { $in: cartIds },
  })

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'No items found to delete' })
  }

  res.status(200).json({ message: 'Selected items deleted successfully' })
}

export const getTotalCart = async (userId) => {
  const cartItems = await Cart.find({ userId }).populate('productId')

  let totalAmount = 0

  cartItems.forEach((item) => {
    // totalAmount += item.quantity * item.productId.price
    totalAmount += item.quantity * item.productId.price * 100
  })

  return totalAmount
}

export const getTotalCartAmount = async (req, res) => {
  const { userId } = req.params

  const totalAmount = await getTotalCart(userId)

  res.status(200).json({
    totalAmount: totalAmount, // Return total amount in cents (e.g., 2000 cents = PHP 20.00)
  })
}
