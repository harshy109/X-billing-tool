import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_, res) => {
	res.json({ status: 'ok', service: 'x-billing-backend' })
})

app.use('/api/auth', authRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app