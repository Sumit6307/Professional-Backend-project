import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()


router.route("/register").post(
    upload.fields([                 // this upload is use for the uploadation of the avator and coverimage to the cloudnary 
       {  
          name : "avatar",
          maxCount : 1
       },
       {
   
           name : "coverImage",
           maxCount : 1
       }
    ]),
    registerUser
)


router.route("/login").post(loginUser)


router.route("/logout").post( verifyJWT, logoutUser)


export default router