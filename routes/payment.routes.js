import express from "express"
import authenticate from "../middleware/middleware.js"

import paymentController from "../controller/payment.controller.js"

const paymentRouter=express.Router()


paymentRouter.post("/:orderId",authenticate,paymentController.createPaymentLink)
paymentRouter.get("/",authenticate,paymentController.updatePaymentInfo)

export default{paymentRouter}