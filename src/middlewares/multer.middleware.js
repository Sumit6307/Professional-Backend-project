import multer from "multer";



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")                     // Here cb denotes  "Call - Back"    we use cb = next
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)    // we can also use a specific unique name also
    }
  })

  export const upload = multer({
     storage ,
    })