import { v2 as cloudinary } from 'cloudinary';
import fs, { unlink } from "fs"     // fs is used to read , write basically does the file operation
import mongoose from 'mongoose';


cloudinary.config({ 

    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key:   process.env.CLOUDINARY_CLOUD_KEY , 
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});

 
  const uploadOnCloudinary = async (localFilePath) => {
       try {
           if(!localFilePath)   return null 
            // upload the file on cloudnary
          const response =  await cloudinary.uploader.upload(localFilePath,  {
                  resource_type : "auto"
            })
         // File has been uploaded successfully
     //  ***  console.log("file is uploaded successfuly on cloudinary " ,
     //       response.url);
            fs.unlinkSync(localFilePath)
           return response;
     } catch(error) {
            fs.unlinkSync(localFilePath)   // Remove the locally saved temporary file as the upload operation got failed 
              return null;
       }
  }

  export {uploadOnCloudinary}
