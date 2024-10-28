import Cart from '../models/cartItem.model.js'

export const addToCart = async (req, res) => {
  const { productId, userId, quantity } = req.body

  try {
    let cartItem = await Cart.findOne({ productId, userId })

    if (cartItem) {
      cartItem.quantity += quantity
      await cartItem.save()
    } else {
      cartItem = new Cart({ productId, userId, quantity })
      await cartItem.save()
    }

    res.status(200).json({ message: 'Item added to cart', cartItem })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
