import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"

export default function HomePage() {
	const { data: session, status } = useSession()
	const signedIn = status === "authenticated"
	const router = useRouter()

	const checkIn = useCallback(() => {
		!signedIn && router.push("auth/signin")
	}, [signedIn, router])

	useEffect(() => {
		checkIn()
	}, [checkIn])

	return (
		<>
			{signedIn && (
				<Layout>
					<h1>Hello, {session?.user.name}</h1>
				</Layout>
			)}
		</>
	)
}
