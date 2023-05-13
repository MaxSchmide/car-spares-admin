import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo_white.svg"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
const Header = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const logout = async () => {
		await router.push("/")
		await signOut()
	}
	return (
		<header className="flex justify-between p-4 items-center text-white bg-primary border-b-2 border-b-secondary">
			<Link
				href="/"
				className="flex gap-1 items-center"
			>
				<Image
					src={logo}
					alt="logo"
					width={50}
					height={20}
				/>
				<span>Admin Panel</span>
			</Link>

			<div className="flex items-center gap-4">
				<button onClick={logout}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
						/>
					</svg>
				</button>
				<p>{session?.user.name}</p>
			</div>
		</header>
	)
}

export default Header
