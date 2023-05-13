import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
	interface Session {
		user: {
			address: string
		} & DefaultSession["user"]
	}
}
interface User {}
interface Account {}
interface Profile {}
