import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"

export default function HomePage() {
	const { data: session, status } = useSession()
	const signedIn = status === "authenticated"
	const { push, locale } = useRouter()

	const checkIn = useCallback(() => {
		!signedIn && push("auth/signin", "auth/signin", { locale })
	}, [signedIn, push, locale])

	useEffect(() => {
		checkIn()
	}, [checkIn])

	return (
		<>
			{signedIn && (
				<Layout>
					<h1>
						{locale === "en" ? "Hello" : "Добро пожаловать"}, &nbsp;
						{session?.user.name}
					</h1>
				</Layout>
			)}
		</>
	)
}
