import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

const OrdersPage = () => {
	const { status } = useSession()
	const router = useRouter()
	const signedIn = status === "authenticated"
	useEffect(() => {
		!signedIn && router.push("auth/error?error=AccessDenied")
	}, [signedIn, router])
	return <>{signedIn && <Layout> Orders</Layout>}</>
}

export default OrdersPage
