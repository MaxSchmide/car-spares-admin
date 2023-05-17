import { signIn, getSession, getCsrfToken } from "next-auth/react"
import { useRouter } from "next/router"

const SignInPage = () => {
	const { locale } = useRouter()

	return (
		<div className="min-h-screen bg-blue-900 flex items-center justify-center">
			<button
				onClick={() => signIn("google")}
				className="p-4 px-8 bg-white rounded-md"
			>
				{locale === "en" ? "Login with Google" : "Войти с Google"}
			</button>
		</div>
	)
}

export async function getServerSideProps(context: any) {
	const { req } = context
	const session = await getSession({ req })

	if (session) {
		return {
			redirect: { destination: "/" },
		}
	}
}

export default SignInPage
