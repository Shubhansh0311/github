import Address from "../modals/address.modal.js";
import cartService from "./cart.service.js";
import Order from "../modals/order.modal.js";
import OrderItems from "../modals/orderitems.modal.js";


  const createOrder = async (user, shippingAddress) => {
    console.log("shippingAddress", shippingAddress);
    console.log("user", user);
    
    
    let address;
  
    try {
      // ✅ Step 1: Reuse existing address if _id is provided
      if (shippingAddress._id) {
        address = await Address.findById(shippingAddress._id);
      } else {
        // ✅ Step 2: Try to find a matching address with the same fields
        address = await Address.findOne({
          user: user._id,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          streetAddress: shippingAddress.streetAddress,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipcode: shippingAddress.zipcode,
          mobile: shippingAddress.mobile
        });
  
        // ✅ Step 3: If no match, create new address
        if (!address) {
          address = new Address({ ...shippingAddress, user: user._id });

          let ad=(await address.save()).populate("shippingAddress");
  console.log("Address created:", ad);
          // ✅ Step 4: Only push if address not already in user's address list
          if (!user.address.includes(address._id)) {
            user.address.push(address._id);
            await user.save();
          }
        }
      }
  
      // ✅ Step 5: Get user's cart
      const cart = await cartService.findUserCart(user._id);
      const orderItems = [];
  
      // ✅ Step 6: Convert cart items into OrderItems
      for (const item of cart.cartItems) {
        const orderItem = new OrderItems({
          price: item.price,
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          userId: item.userId,
          discountedPrice: item.discountedPrice,
        });
  
        const createdOrderItem = await orderItem.save();
        orderItems.push(createdOrderItem);
      }
  
      // ✅ Step 7: Create the Order
      const newOrder = new Order({
        user,
        orderItems,
        totalPrice: cart.totalPrice,
        discount: cart.discounts,
        totalDiscountedPrice: cart.totalDiscountedPrice,
        totalItems: cart.totalItems,
        shippingAddress: address,
      });
  
      const savedOrder = await newOrder.save();
      return savedOrder;
  
    } catch (error) {
      console.log(error.message);
      throw new Error("Failed to create order: " + error.message);
    }
  };


const placeOrder = async (orderId) => {
  try {
    const order = await findOrderById(orderId);
    order.orderStatus = "PLACED";
    order.paymentDetails.paymentStatus = "COMPLETED";
    return await order.save();
  } catch (error) {
    console.error(error.message);
    throw new Error("Order not placed");
  }
};

const cancelOrder = async (orderId) => {
  try {
    const order = await findOrderById(orderId);
    order.orderStatus = "CANCELLED";
    return await order.save();
  } catch (error) {
    console.error(error.message);
    throw new Error("Order not cancelled");
  }
};

const shippedOrder = async (orderId) => {
  try {
    const order = await findOrderById(orderId);
    order.orderStatus = "SHIPPED";
    return await order.save();
  } catch (error) {
    console.error(error.message);
    throw new Error("Order not shipped");
  }
};

const deliverOrder = async (orderId) => {
  try {
    const order = await findOrderById(orderId);
    order.orderStatus = "DELIVERED";
    return await order.save();
  } catch (error) {
    console.error(error.message);
    throw new Error("Order not delivered");
  }
};

const confirmOrder = async (orderId) => {
  try {
    const order = await findOrderById(orderId);
    order.orderStatus = "CONFIRMED";
    return (await order.save()).populate("orderItems").populate("shippingAddress");
  } catch (error) {
    console.error(error.message);
    throw new Error("Order not confirmed");
  }
};

const findOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "orderItems",
        populate: { path: "product" },
      })
      .populate("shippingAddress");

    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  } catch (error) {
    console.error(error.message);
    throw new Error("Order not found");
  }
};

const orderHistory = async (userId) => {
  try {
    const orders = await Order.find({ user: userId, orderStatus: "PLACED" })
      .populate({
        path: "orderItems",
        populate: { path: "product" },
      })
      .lean();

    if (!orders || orders.length === 0) {
      throw new Error("No orders found for this user");
    }
    return orders;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch order history");
  }
};

const getAllOrders = async () => {
  try {
    const orders = await Order.find()
      .populate({
        path: "orderItems",
        populate: { path: "product" },
      })
      .lean();

    if (!orders || orders.length === 0) {
      throw new Error("No orders found");
    }
    return orders;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch all orders");
  }
};

const deleteOrder = async (orderId) => {
  try {
    const order = await findOrderById(orderId);
    await Order.findByIdAndDelete(order._id);
    return { message: "Order deleted successfully" };
  } catch (error) {
    console.error(error.message);
    throw new Error("Order not deleted");
  }
};

export default {
  cancelOrder,
  createOrder,
  deleteOrder,
  shippedOrder,
  deliverOrder,
  findOrderById,
  orderHistory,
  confirmOrder,
  getAllOrders,
  placeOrder,
};
