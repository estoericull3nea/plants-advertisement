// ================================== Imports ==================================
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './api/utils/connectDB.js'

import { Server } from 'socket.io'
import http from 'http'

const allowedOrigins = [process.env.VITE_DEV_FRONTEND_URL]

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
})

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id)

  socket.on('updateCartCount', (data) => {
    console.log('updateCartCount received: ', data)
    io.emit('newUpdateCartCount', data)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

import authRouter from './api/routes/auth.route.js'
import userRouter from './api/routes/user.route.js'
import productRouter from './api/routes/product.route.js'
import addCartRouter from './api/routes/cart.route.js'
import chatRouter from './api/routes/chat.route.js'

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
app.use('/api/v1/products', productRouter)
app.use('/api/v1/carts', addCartRouter)
app.use('/api/v1/chats', chatRouter)

// ================================== Connection to MongoDB ==================================
connectDB()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`Server is Running on PORT ${PORT} and Connected to Database`)
    )
  })
  .catch((err) => console.log(err))
