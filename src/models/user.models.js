import mongoose from "mongoose";
import jwt from "jsonwebtoken"          // for string generator
import bcrypt from "bcrypt"             // For password bcrypting

const userSchema = new mongoose.Schema({
     
            username  : {
                type : String,
                required : true,
                lowercase : true,
                unique : true,
                trim : true,
                index : true     // index is for searching option
        },
            
        email  : {
            type : String,
            required : true,
            lowercase : true,
            unique : true,
            trim : true,
    },
               
   fullname  : {
    type : String,
    required : true,
    trim : true,
    index : true
},
   avatar : {
      type : String,                // cloudinary url
      required : true

   },

    coverimage : {
          type : String         // cloudinary url
    },
      
    watchHistory  : [
          {
              type : mongoose.Schema.Types.ObjectId,
              ref : "Video"
          }
    ],

      password : {
          type  : String,              // use bcrypt for encodng and decoding password
          required : [true , "Password is Required"]
      },
      refershTokens : {
        type : String
      }


}, {timestamps : true})
  

userSchema.pre("save", async function (next) {
     if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
        
    return await  bcrypt.compare(password, this.password)
}


  userSchema.methods.generateAccessToken = function() {
     return  jwt.sign({         // Jwt is use for generate the bearing token
        _id : this._id,
        email : this.email,
        username : this.username,
        fullname : this.fullname
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn : process.env.ACCESS_TOKEN_EXPITY
      }
     )
  }
  userSchema.methods.generateRefreshToken = function() {
    return  jwt.sign({
        _id : this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn : process.env.REFRESH_TOKEN_SECRET
      }
     )
  }




export const User = mongoose.model("User", userSchemaserSchema)
