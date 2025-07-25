import cartService from "../services/cart.service.js";

const createCart = async (req, res) => {
  try {
    const user = await req.user;
    const cart = await cartService.createCart(user);
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const findUserCart = async (req, res) => {


  try {
    const userId = await req?.user?._id;
if(userId === undefined || userId === null) {
      return res.status(400).json({ message: "User ID is not defined" });
    }
    const cartItem = await cartService.findUserCart(userId);
    return res.status(200).json(cartItem);
  } catch (error) {
    // return res.status(500).json({ message: error.message });
    console.log(error.message);
    throw new Error(error.message);
  }
};
const addCartItem = async (req, res) => {


  try {
    const userId = req.user._id;

    const cartItem = await cartService.addCartItem(userId, req.body);

    return res.status(200).json({ message: cartItem });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItemId, quantity } = req.body;

    const cart = cartItemId;
    
    const updatedCartItem = await cartService.updateCartItem(
      userId,
      cart,
      quantity
    );

    return res
      .status(200)
      .json({
        id:cart,
        message: "Cart item updated successfully",
        itemUpdated: updatedCartItem,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.body;
  

    const deletedCartItem = await cartService.deleteCartItem(userId, itemId);

    return res
      .status(200)
      .json({id:itemId ,message: "Cart item deleted successfully",
        itemDeleted: deletedCartItem,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export default {
  createCart,
  findUserCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
};
