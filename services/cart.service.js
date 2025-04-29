import Cart from "../modals/cart.modal.js";
import CartItems from "../modals/cartitem.modal.js";
import Product from "../modals/product.modal.js";

const createCart = async (user) => {
  try {
    const cart = new Cart({ user });
    const cartCreated = await cart.save();

    // console.log("Cart craeted successfully", cartCreated);
    
    return cartCreated;
  } catch (error) {
    throw new Error(error.message);
  }
};
const findUserCart = async (userId) => {
  // console.log("cartservice",userId);
  try {
    const cart = await Cart.findOne({ user: userId });
    const cartItems = await CartItems.find({ cart: cart._id }).populate(
      "product"
    );
    cart.cartItems = cartItems;
    let totalPrice = 0,
      totalDiscountedPrice = 0,
      totalItems = 0;
      // console.log(cartItems);
      
    for (let cartItem of cart.cartItems) {
      totalPrice += cartItem.price;
      totalDiscountedPrice += cartItem.discountedPrice;
      
    }

    cart.totalPrice = totalPrice;
    cart.discounts = totalPrice - totalDiscountedPrice;
    cart.totalItems =cart.cartItems.length;
cart.totalDiscountedPrice = totalDiscountedPrice;
    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addCartItem = async (userId, req) => {
  
  
  try {
    // console.log("req", req);
    // console.log("userId", userId);
    const cart = await Cart.findOne({ user: userId }); 
  //  console.log("cart", cart);
   

    const product = await Product.findById(req.productId);
   
    
    
    const isProductPresent = await CartItems.findOne({
      cart: cart._id,
      userId: userId,
      product: product._id,
    });
    if (!isProductPresent) {
      let cartItem =new CartItems({
        cart: cart._id,
        product: product._id,
        userId,
        size: req.size,
        quantity: 1,
        price: product.price,
        discountedPrice: product.discountedPrice,
      });
      const createdCartItem = await cartItem.save();
      cart.cartItems.push(createdCartItem);


      
      await cart.save();
     
      return "Item added to the cart ";
    }
  } catch (error) {
    throw new Error(error.message);
  }
};


const updateCartItem = async (userId, cartItemId, quantity) => {
  console.log(userId, cartItemId, quantity);
  
  try {
    // Find the cart item by ID and ensure it belongs to the user
    const cartItem = await CartItems.findOne({_id: cartItemId, userId });


    if (!cartItem) {
      throw new Error("Cart item not found or does not belong to the user");
    }

    // Update the quantity of the cart item
    cartItem.quantity = quantity;

    // Recalculate the price based on the new quantity
    const product = await Product.findById(cartItem.product);
    cartItem.price = product.price * quantity;
    cartItem.discountedPrice = product.discountedPrice * quantity;

    // Save the updated cart item
    const updatedCartItem = await cartItem.save();

    return updatedCartItem;
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteCartItem = async (userId, cartItemId) => {

  
  try {
    // Find the cart item by ID and ensure it belongs to the user
    const cartItem = await CartItems.findOne({_id: cartItemId, userId });


    if (!cartItem) {
      throw new Error("Cart item not found or does not belong to the user");
    }

    // Remove the cart item
    const items= await CartItems.deleteOne({ _id: cartItemId });
console.log(items.length);

    // Optionally, update the cart's total price and total items
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.cartItems = cart.cartItems.filter(
        (item) => item.toString() !== cartItemId
      );
      await cart.save();
    }

    return "Cart item deleted successfully";
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { createCart, findUserCart, addCartItem, updateCartItem, deleteCartItem };


