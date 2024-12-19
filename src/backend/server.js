import cors from 'cors'
import express from 'express'

import { errorHandler } from './middlewares/errorMiddleware.js'
import { UserRouter } from './routes/userRouter.js'

const app = express()
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:8000', // Backend server
    'electron://localhost', // Electron app
    'file://*' // Electron file protocol
  ],
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/user', UserRouter)

app.use(errorHandler)

export default app
