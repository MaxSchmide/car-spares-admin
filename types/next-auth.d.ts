import Nextauth from "@/pages/api/auth/[...nextauth]"

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: User
	}
}
export interface User {
	role?: sting | null
	name?: string | null
	email?: string | null
	image?: string | null
}
