import clientPromise from "@/lib/mongodb"
import { mongooseConnect } from "@/lib/mongoose"
import { Admin, IAdmin } from "@/models/admin.model"
import { User } from "@/types/next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { NextApiRequest, NextApiResponse } from "next"
import { AuthOptions } from "next-auth"
import NextAuth, { getServerSession } from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: AuthOptions = {
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
	},
	callbacks: {
		signIn: async ({ user }) => {
			const { email } = await findInAdminList(user)
			return user.email === email
		},
		session: async ({ session }) => {
			const { role } = await findInAdminList(session?.user)
			session.user.role = role
			return session
		},
	},
}

export default NextAuth(authOptions)

export const isAdminRequest = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const session = await getServerSession(req, res, authOptions)
	const admin = await findInAdminList(session?.user)
	if (!admin) res.status(403).end()
}

const findInAdminList = async (user?: User) => {
	await mongooseConnect()
	const admin = await Admin.findOne({ email: user?.email })
	return admin
}
