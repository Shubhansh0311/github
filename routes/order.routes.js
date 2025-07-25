import express from "express"
import authenticate from "../middleware/middleware.js"
import orderController from "../controller/order.controller.js"
const orderRouter = express.Router()
orderRouter.get('/history/:userId',authenticate ,orderController.orderHistory )
orderRouter.get("/:orderId",authenticate,orderController.findOrderById)
orderRouter.post('/',authenticate ,orderController.createOrder )
export default {orderRouter}