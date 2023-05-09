import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { useSession, signIn } from "next-auth/react"

type LayoutProps = {
	children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
	const { data: session } = useSession()
	return (
		<>
			{!session ? (
				<div className="min-h-screen bg-blue-900 flex items-center justify-center">
					<button
						onClick={() => signIn("google")}
						className="p-4 px-8 bg-white rounded-md"
					>
						Login with Google
					</button>
				</div>
			) : (
				<>
					<Header />
					<main className="flex min-h-screen">
						<Sidebar />
						<article className="flex-grow bg-grey1 p-12">{children}</article>
					</main>
				</>
			)}
		</>
	)
}
