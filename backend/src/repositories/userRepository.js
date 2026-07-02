import bcrypt from 'bcryptjs'

const users = [
	{
		id: 'user-super-admin',
		name: 'Avery Cole',
		email: 'super.admin@xbilling.local',
		passwordHash: bcrypt.hashSync('Admin@123', 10),
		role: 'Super Admin',
	},
	{
		id: 'user-billing-admin',
		name: 'Morgan Hayes',
		email: 'billing.admin@xbilling.local',
		passwordHash: bcrypt.hashSync('Billing@123', 10),
		role: 'Billing Admin',
	},
	{
		id: 'user-readonly-admin',
		name: 'Riley Brooks',
		email: 'readonly.admin@xbilling.local',
		passwordHash: bcrypt.hashSync('ReadOnly@123', 10),
		role: 'Read Only Admin',
	},
]

const findByEmail = async (email) => users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null

const findById = async (id) => users.find((user) => user.id === id) ?? null

export const userRepository = {
	findByEmail,
	findById,
}