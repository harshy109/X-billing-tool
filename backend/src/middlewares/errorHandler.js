import { ApiError } from '../utils/apiError.js'

export const notFoundHandler = (req, res, next) => {
	const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`)
	next(error)
}

export const errorHandler = (error, req, res, next) => {
	const statusCode = error instanceof ApiError ? error.statusCode : 500
	const message = error instanceof ApiError ? error.message : 'Internal server error'

	res.status(statusCode).json({
		message,
		path: req.originalUrl,
	})

	next
}