import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new mongoose.Schema({

    videoFile : {
          type : String,       // Cloudinary url
          required : true,

    },

       thumbnail : {
            type  : String,
            required : true
        },

        description : {
            type  : String,
            required : true
    },

    duration : {
        type : Number,     // cloudnary
        required : true
    },

    views : {
         type : Number,
          default : 0
    },
     
    isPublished : {
          type : Boolean,
           default : true
    },

     owner :  {
          type : mongoose.Schema.Types.ObjectId,
          ref : "User"
     }
}, {timestamps : true})


  
VideoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video", VideoSchema)