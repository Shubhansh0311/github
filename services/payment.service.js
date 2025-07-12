import razorpay from "../config/razorpayclient.js"

import orderService from "./order.service.js";
const createPayment = async (orderId) => {
  try {
    const order = await orderService.findOrderById(orderId);

    const paymentLinkRequest = {
      // amount: order.totalPrice * 100||500,
      amount:1000*100,
      currency: "INR",
      customer: {
        name: `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email,
        contact:order.user.mobile
      },
      notes: {
        orderId: orderId,
        userId: order.user._id.toString()
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `http://localhost:3000/payment/${orderId}`,
      callback_method: "get",
    };

    
    

    const createPaymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
   
const resdata= {
  paymentLink_id: createPaymentLink.id,
  paymentLink_url: createPaymentLink.short_url
};
    return resdata
  } catch (error) {
    throw new Error(error.error?.description || "Failed to create payment link");
  }
};

const updatePaymentInformation =async(reqdata)=>{
    const paymentId=reqdata.payment_id
    const orderId=reqdata.order_id
    try {
const order =await orderService.findOrderById(orderId)
const paymentInfo=await razorpay.payments.fetch(paymentId)

if(paymentInfo){
    order.paymentDetails.paymentId=paymentId,
    order.paymentDetails.status="Completed",
    order.orderStatus="Placed"
    await order.save()
}
    const responseData={message:"Your Order has been successfully placed",status:"success"}
    return responseData     
    } catch (error) {
        throw new Error(error)
    }
}
export default{createPayment,updatePaymentInformation}