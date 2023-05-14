import { signIn, getSession, getCsrfToken } from "next-auth/react"

const SignInPage = () => {
	return (
		<div className="min-h-screen bg-blue-900 flex items-center justify-center">
			<button
				onClick={() => signIn("google")}
				className="p-4 px-8 bg-white rounded-md"
			>
				Login with Google
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
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	}
}

export default SignInPage
