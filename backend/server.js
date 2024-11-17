// ================================== Imports ==================================
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './api/utils/connectDB.js'

import { Server } from 'socket.io'
import http from 'http'

import User from './api/models/user.model.js'

const allowedOrigins = [
  process.env.VITE_DEV_FRONTEND_URL,
  'http://localhost:5173',
]

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
})

const onlineUsers = new Map()

io.on('connection', (socket) => {
  // console.log('A client connected:', socket.id)

  socket.on('join', async (userId) => {
    console.log('User joined:', userId)
    onlineUsers.set(userId, socket.id)

    // Update last active time
    await User.findByIdAndUpdate(userId, { lastActive: Date.now() })

    // Notify other users that this user is online
    socket.broadcast.emit('userStatusUpdate', { userId, online: true })
  })

  socket.on('updateCartCount', (data) => {
    console.log('updateCartCount received: ', data)
    io.emit('newUpdateCartCount', data)
  })

  socket.on('message', (data) => {
    io.emit('newMessage', data)
  })

  socket.on('disconnect', () => {
    onlineUsers.forEach(async (value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key)

        // Optionally update lastActive when the user disconnects
        await User.findByIdAndUpdate(key, { lastActive: Date.now() })

        socket.broadcast.emit('userStatusUpdate', {
          userId: key,
          online: false,
        })
      }
    })
    console.log('Client disconnected:', socket.id)
  })
})

app.use((req, res, next) => {
  req.io = io
  next()
})

import authRouter from './api/routes/auth.route.js'
import userRouter from './api/routes/user.route.js'
import productRouter from './api/routes/product.route.js'
import addCartRouter from './api/routes/cart.route.js'
import chatRouter from './api/routes/chat.route.js'
import likeRouter from './api/routes/like.route.js'
import commentRouter from './api/routes/comment.route.js'
import userModel from './api/models/user.model.js'
import shareRouter from './api/routes/share.route.js'
import contactRouter from './api/routes/contact.route.js'
import plantRouter from './api/routes/plantCalendar.route.js'
import dataRouter from './api/routes/data.route.js'
import paymentRouter from './api/routes/payment.route.js'

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
app.use('/api/v1/likes', likeRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/shares', shareRouter)
app.use('/api/v1/contacts', contactRouter)
app.use('/api/v1/plants', plantRouter)
app.use('/api/v1/datas', dataRouter)
app.use('/api/v1/payments', paymentRouter)

// ================================== Connection to MongoDB ==================================
connectDB()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`Server is Running on PORT ${PORT} and Connected to Database`)
    )
  })
  .catch((err) => console.log(err))
