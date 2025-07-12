import paymentservice from "../services/payment.service.js"
const createPaymentLink=async(req,res)=>{
   
    const orderId=req.params.orderId
  
    
     try {
    const paymentLink=await paymentservice.createPayment(orderId) 
     
    res.status(200).send(paymentLink)
 } catch (error) {
    res.status(500).json({message:error.message})
 }
}

const updatePaymentInfo=async (req,res) => {
try {
    await paymentservice.updatePaymentInformation(req,query)
    return res.status(200).json({messag:'payment information updated successfully '})
} catch (error) {
    return res.status(500).json({message:error.message})
}
}
export default {updatePaymentInfo,createPaymentLink}