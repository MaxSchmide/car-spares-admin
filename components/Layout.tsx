import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { useSession, signIn } from "next-auth/react"

type LayoutProps = {
	children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
	return (
		<>
			<Header />
			<main className="flex min-h-screen">
				<Sidebar />
				<article className="flex-grow bg-grey1 p-12">{children}</article>
			</main>
		</>
	)
}
