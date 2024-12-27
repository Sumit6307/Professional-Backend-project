import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json({limit : "16kb"}))
app.use(urlencoded({extended: true, linit : "6kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes

import userRouter from './routes/user.routes.js'

// route declarations

app.use("/api/v1/users", userRouter)              // we cannot user app.get bcz all things are segerate there  1. the routes and both both are in different folders .So we use middleware for this





export {app}
//export default app