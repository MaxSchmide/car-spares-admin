import Layout from "@/components/Layout"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"

const OrdersPage = () => {
	const { locale } = useRouter()

	const engLanguage = locale === "en"

	return <Layout> {engLanguage ? "Orders" : "Заказы"}</Layout>
}
export const getServerSideProps = async (context: any) => {
	const { req, defaultLocale } = context
	const session = await getSession({ req })
	if (!session) {
		return {
			redirect: {
				destination: `${defaultLocale}/auth/signin`,
			},
		}
	}
	return {
		props: {},
	}
}

export default OrdersPage
