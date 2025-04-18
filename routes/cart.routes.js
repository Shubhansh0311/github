import express from "express"
import authenticate from "../middleware/middleware.js"
import cartController from "../controller/cart.controller.js"
const cartRouter = express.Router()

cartRouter.get('/',authenticate ,cartController.findUserCart )
cartRouter.post('/add',authenticate ,cartController.addCartItem )
cartRouter.post('/update',authenticate ,cartController.updateCartItem )
cartRouter.post('/delete',authenticate ,cartController.deleteCartItem )
// cartRouter.post('/add',(req,res)=>{
//     res.json({message:"cart add",data:req.body})
// }
// )


export default {cartRouter}