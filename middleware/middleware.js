import userService from "../services/user.service.js";
import jwtprovider from "../config/jwtprovider.js";

const authenticate=async(req, res,next) => { 
try {
let token=await req.headers.authorization.split(" ")[1];


if(!token){
    return res.status(401).json({message:"unauthorized user",error:"token not found"})
}


let userId=await jwtprovider.getUserIdFromToken(token);


let user=await userService.getUserById(userId);

    req.user=user;


} catch (error) {
   
    // throw new Error("message:",error.message);
    console.log("test",error.stack);
    
  
}
next()
 }

 export default authenticate;