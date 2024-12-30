import mongoose from "mongoose";



const  SubscriptionSchema = new mongoose.Schema( {

    subscriber : {
          type : mongoose.Schema.Types.ObjectId,            // USER SUBSCRIBER
          ref  : "User"
    },

     channel :  {                                             // CHANNEL -> THOSE WHO UPLOADING VIDEOS
           type : mongoose.Schema.Types.ObjectId,
           ref : "User"    
     }
 
} , { timestamps : true })



export const Subscription = mongoose.models("Subscription" , SubscriptionSchema )