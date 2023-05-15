import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo_white.svg"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"

const Header = () => {
	const router = useRouter()
	const { data: session } = useSession()

	const logout = async () => {
		await router.push("auth/signin")
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
					<ArrowRightOnRectangleIcon className="h-6 w-6" />
				</button>
				<p>{session?.user.name}</p>
			</div>
		</header>
	)
}

export default Header
