import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/apiError.js'
import { userRepository } from '../repositories/userRepository.js'

const refreshTokenStore = new Set()

const accessTokenConfig = () => ({
	secret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
	expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
})

const refreshTokenConfig = () => ({
	secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
	expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
})

const createTokenPair = (user) => {
	const accessToken = jwt.sign(
		{
			sub: user.id,
			email: user.email,
			role: user.role,
		},
		accessTokenConfig().secret,
		{ expiresIn: accessTokenConfig().expiresIn },
	)

	const refreshToken = jwt.sign(
		{
			sub: user.id,
			type: 'refresh',
		},
		refreshTokenConfig().secret,
		{ expiresIn: refreshTokenConfig().expiresIn },
	)

	refreshTokenStore.add(refreshToken)

	return { accessToken, refreshToken }
}

const login = async ({ email, password }) => {
	if (!email || !password) {
		throw new ApiError(400, 'email and password are required')
	}

	const user = await userRepository.findByEmail(email)

	if (!user) {
		throw new ApiError(401, 'Invalid credentials')
	}

	const passwordMatches = await bcrypt.compare(password, user.passwordHash)

	if (!passwordMatches) {
		throw new ApiError(401, 'Invalid credentials')
	}

	const tokens = createTokenPair(user)

	return {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
		...tokens,
	}
}

const refreshTokenAction = async ({ refreshToken }) => {
	if (!refreshToken) {
		throw new ApiError(400, 'refreshToken is required')
	}

	if (!refreshTokenStore.has(refreshToken)) {
		throw new ApiError(401, 'Refresh token is not recognized')
	}

	let decoded

	try {
		decoded = jwt.verify(refreshToken, refreshTokenConfig().secret)
	} catch {
		refreshTokenStore.delete(refreshToken)
		throw new ApiError(401, 'Refresh token is invalid or expired')
	}

	const user = await userRepository.findById(decoded.sub)

	if (!user) {
		throw new ApiError(401, 'User no longer exists')
	}

	refreshTokenStore.delete(refreshToken)
	return {
		...createTokenPair(user),
	}
}

const logout = async ({ refreshToken }) => {
	if (refreshToken) {
		refreshTokenStore.delete(refreshToken)
	}

	return { message: 'Logged out successfully' }
}

export const authService = {
	login,
	refreshToken: refreshTokenAction,
	logout,
}