// ================================== Imports ==================================
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './api/utils/connectDB.js'

const allowedOrigins = [process.env.VITE_DEV_FRONTEND_URL]

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

import authRouter from './api/routes/auth.route.js'
import userRouter from './api/routes/user.route.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)

// ================================== Connection to MongoDB ==================================
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is Running on PORT ${PORT} and Connected to Database`)
    )
  })
  .catch((err) => console.log(err))
