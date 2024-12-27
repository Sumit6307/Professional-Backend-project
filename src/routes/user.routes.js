import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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
    registerUser)






export default router