import { authService } from '../services/authService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body ?? {}
	const result = await authService.login({ email, password })

	res.json(result)
})

export const refreshToken = asyncHandler(async (req, res) => {
	const { refreshToken } = req.body ?? {}
	const result = await authService.refreshToken({ refreshToken })

	res.json(result)
})

export const logout = asyncHandler(async (req, res) => {
	const { refreshToken } = req.body ?? {}
	const result = await authService.logout({ refreshToken })

	res.json(result)
})