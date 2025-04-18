import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
// import authRouters from "./routes/auth.routes.js";
// import userRouters from "./routes/user.routes.js";
import productRouters from "./routes/product.routes.js";
// import cartRouters from "./routes/cart.routes.js";
// import cartItemRoutes from "./routes/cartItem.routes.js";
// import reviewRouters from "./routes/review.routes.js";
// import ratingRouters from "./routes/rating.routes.js";
// import orderRouters from "./routes/order.routes.js";
// import adminOrderRouters from "./routes/adminOrder.routes.js";
// import adminProductRouters from "./routes/adminProduct.routes.js";
import dbConnect from "./config/db.js";

const app = express();

// const corsOptions = {
//     origin: 'https://ecommerce-eta-sandy.vercel.app', // Your React app URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//     credentials: true, // Include cookies in requests if needed
// };

// app.options('*', cors(corsOptions)); // Handle preflight requests
// app.use(cors(corsOptions));
// dotenv.config();
app.use(express.json());
app.use(cors())
dbConnect()
// app.listen(808,async()=>{
// await 

//     console.log("server is running on port 808")

// }
// )

app.get("/test", (req, res) => {    
    res.send("Hello from server")
})
// // authentication
// app.use("/auth",authRouters.authRouter);

// // users
// app.use("/api/users", userRouters.userRouter);

// // admin products
// app.use("/api/admin/products", adminProductRouters.adminProductRouter);

// // admin orders
// app.use("/api/admin/orders", adminOrderRouters.adminOrderRouter)

// // products
app.use("/api/products",productRouters.productRouter);

// // cart
// app.use("/api/cart", cartRouters.cartRouter);

// // cart items
// app.use("/api/cart_items", cartItemRoutes.cartItemRouter);

// // review
// app.use("/api/review", reviewRouters.reviewRouter);

// // rating
// app.use("/api/rating", ratingRouters.ratingRouter);

// // orders
// app.use("/api/orders", orderRouters.orderRouter);

export default app;