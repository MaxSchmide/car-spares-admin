import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useEffect } from "react"

const OrdersPage = () => {
	const { status } = useSession()
	const signedIn = status === "authenticated"
	const router = useRouter()

	useEffect(() => {
		!signedIn && router.push("auth/error?error=AccessDenied")
	}, [signedIn, router])

	return <>{signedIn && <Layout>OrdersPage</Layout>}</>
}

export default OrdersPage
