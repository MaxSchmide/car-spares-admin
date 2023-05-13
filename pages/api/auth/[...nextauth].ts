import clientPromise from "@/lib/mongodb"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { NextApiRequest, NextApiResponse } from "next"
import { AuthOptions } from "next-auth"
import NextAuth, { getServerSession } from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"

const adminList = ["schmide.max@gmail.com"]

export const authOptions: AuthOptions = {
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		session({ session, token, user }) {
			if (adminList.includes(session.user.email!)) return session
			else throw "Not a valid permitions"
		},
	},
}

export default NextAuth(authOptions)

export const isAdminRequest = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const session = await getServerSession(req, res, authOptions)
	if (!adminList.includes(session?.user.email!)) res.status(401).end()
}
