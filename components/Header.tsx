import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo_white.svg"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import {
	ArrowRightOnRectangleIcon,
	Bars3Icon,
} from "@heroicons/react/24/outline"

type Props = {
	isShow: boolean
	show: () => void
}

const Header = ({ isShow, show }: Props) => {
	const router = useRouter()
	const { data: session } = useSession()

	const logout = async () => {
		await router.push("auth/signin")
		await signOut()
	}
	return (
		<header className="flex min-h-[84px] justify-between p-4 items-center text-white bg-primary border-b-2 border-b-secondary z-50 tablet:fixed tablet:w-full  ">
			<div className="flex gap-4 items-center">
				<Link
					href="/"
					className="flex gap-1 items-center"
				>
					<Image
						src={logo}
						alt="logo"
						className="w-12 h-12"
					/>
					<span className="tablet:hidden">Admin Panel</span>
				</Link>
				<span
					className="hidden tablet:block cursor-pointer"
					onClick={show}
				>
					<Bars3Icon className="h-6 w-6 text-white" />
				</span>
			</div>

			<div className="flex items-center gap-4">
				<button onClick={logout}>
					<ArrowRightOnRectangleIcon className=" h-6 w-6" />
				</button>
				<p className="mobile:hidden">{session?.user.name}</p>
			</div>
		</header>
	)
}

export default Header
