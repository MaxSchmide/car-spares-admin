import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

const OrdersPage = () => {
	const { status } = useSession()
	const { push, locale } = useRouter()

	const signedIn = status === "authenticated"
	const engLanguage = locale === "en"

	useEffect(() => {
		!signedIn && push("auth/error?error=AccessDenied")
	}, [signedIn, push])

	return (
		<>{signedIn && <Layout> {engLanguage ? "Orders" : "Заказы"}</Layout>}</>
	)
}

export default OrdersPage
