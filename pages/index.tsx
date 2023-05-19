import Layout from "@/components/Layout"
import { getSession, useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function HomePage() {
	const { data: session } = useSession()
	const { locale } = useRouter()

	return (
		<>
			<Layout>
				<h1>
					{locale === "en" ? "Hello" : "Добро пожаловать"}, &nbsp;
					{session?.user.name}
				</h1>
			</Layout>
		</>
	)
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
