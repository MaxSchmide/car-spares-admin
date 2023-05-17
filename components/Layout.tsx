import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { useState } from "react"

type LayoutProps = {
	children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
	const [showSidebar, setShowSidebar] = useState(false)

	const handleShowSidebar = () => setShowSidebar(!showSidebar)

	return (
		<>
			<Header
				isShow={showSidebar}
				show={handleShowSidebar}
			/>
			<main className="flex min-h-screen pt-[84px]">
				<Sidebar
					isShow={showSidebar}
					show={handleShowSidebar}
				/>
				<article className="flex-grow bg-grey1 px-20 py-12 mobile:p-6">
					{children}
				</article>
			</main>
		</>
	)
}
