import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
  
    



   const generateAccessAndRefreshTokens =  async(userId) => {
     try {
       const user = await User.findById(userId)
     const accessToken =   user.generateAccessToken()
     const refreshToken =   user.generateRefreshToken()

      user.refreshToken = refreshToken
     await  user.save({validateBeforeSave : false})

      return {accessToken , refreshToken}

     
     }
     catch (error) {
        throw new ApiError(500, "Something wend wrong while generating refresh and Access Token")
     }
   } 


const registerUser = asyncHandler(async (req,res) => {
           // get user details from frontend                                         (Done)
           // validation - not empy                                                  (Done)
          //   check if user already exists : username, email                        (Done)
          //   check for images , check for avatar                                   (Done)
          //  upload them to cloudnary  return the string url                        (Done)
          //    create user object - crate entry in db                               (Done)
          //   remove password and refresh token filed from response                 (Done)
          //  check for user creation if the user is created or not                  (Done)
          //   return response

                               // get user details from frontend 

       const {fullname, email, username, password} = req.body
       console.log("email : ",email);
       console.log("username : ",username);
       console.log("fullname : ",fullname);
       console.log("password : ",password);

                                 // validation - not empy                         
          if (
                  [fullname,email,username,password].some((field)=> 
                        field?.trim() === "") 
                  
          ) {
               
            throw new ApiError(400, "All filed are required")

          }

          //   check if user already exists : username, email                        
                                  
          
     const existedUser =  await User.findOne({
      
           $or : [{ username } , { email }]      // ($or) -> is used to use operator in a simple way
           
    })  
    
      if(existedUser) {
          throw new ApiError(409, "User with email or username already exists")
      }
   //   console.log(req.files);   (for  our learning purpose we console this to know the property)
        
          //   check for images , check for avatar
                          

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath =  req.files?.coverImage[0]?.path;    this is unable to resolve the probelm of undefine so we se anothe syntax

    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >  0) {
         coverImageLocalPath = req.files.coverImage[0].path          // thi is the modification of the cover image to resolve the problem of undefined
    }
       

     if(!avatarLocalPath) {
          throw new ApiError(400, "Avator file is required")
     }
  
          //  upload them to cloudnary  return the string url  
                         
    const avatar =   await uploadOnCloudinary(avatarLocalPath)
     const  coverImage =  await  uploadOnCloudinary(coverImageLocalPath)
 
                    // Double checking of the Avatar
       if(!avatar) {
        throw new ApiError(400, "Avatar is Required")
       }

                      //    create user object - crate entry in db - Sumit 
               
      const user =   await User.create({
           fullname ,
           avatar : avatar.url, 
                           // Checking whether the cover image is in the case or not
           coverImage : coverImage?.url || "",  
           email,
           password,
           username : username.toLowerCase()
       })


     //  remove password and refresh token filed from response
        
      const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"       // this minus(-) sign indicating the not selecting object from the stack
      )
                             //  check for user creation if the user is created or not
        if(!createdUser) {
             throw new ApiError(500, "Something went wrong while registering the user")
        }


       return  res.status(201).json(
           new ApiResponse(200, createdUser , "User registered Successfuly")
       ) 

})

const loginUser  = asyncHandler( async ( req,res) => {
       // req body -> data               (Done)
       // username or email              (Done)
       // find  the user                 (Done)
       //  password  check               (Done)
       // access and refresh token       (Done)
       // send cookies               
     

                   // req body -> data 
         const { username , email , password} = req.body
            
         console.log("username : " , username);
         console.log("email : " , email);
         console.log("password : ", password);

                  // username or email
    if(!username && !email) {
         throw new ApiError(400,"Username or Password is required")
    }
                   // find  the user
   const user =   await User.findOne({

     $or : [{username}, {email}]
   })

     if(!user) {
        throw new ApiError(400, "User does not exist")
     } 
                           
                            //  password  check

    const isPasswordValid =  await user.isPasswordCorrect(password)


    if(!isPasswordValid) {
      throw new ApiError(401, "Password is Incorrect")
   }

                   // Acccess and Refresh Token

       const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)


                  // Send Cookies
    
        const loggedInUser =  await User.findById(user._id).
        select("-password -refreshToken")
        
        
        const options = {
            httpOnly : true,
            secure : true
        }

     return res.
     status(200)
     .cookie("accessToken",accessToken , options)
     .cookie("refreshToken" , refreshToken , options)
     .json (
         new ApiResponse (
          200,
           {
              user : loggedInUser , accessToken , refreshToken     // data
           },
            "User LoggedIn Successfully"
         )
     )
})


  const logoutUser=  asyncHandler(async (req,res) =>   {

      await  User.findByIdAndUpdate(
          req.user._id ,
          {
            $set : {
              refreshToken :  undefined,
              
            }
          },
          {
              new : true
          }
        )

      const options = {
          httpOnly : true,
          secure : true
      }
            
    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200,{}, "User logged Out"))

})

export {
    registerUser,
    loginUser,
    logoutUser
}