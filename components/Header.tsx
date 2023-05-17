import logo from "@/assets/logo_white.svg"
import { HeaderSelectStyle } from "@/utils/main"
import {
	ArrowRightOnRectangleIcon,
	Bars3Icon,
} from "@heroicons/react/24/outline"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import Select, { SingleValue } from "react-select"
import makeAnimated from "react-select/animated"

type Props = {
	isShow: boolean
	show: () => void
}

const Header = ({ isShow, show }: Props) => {
	const { pathname, push, locale, locales } = useRouter()

	const title = locale === "en" ? "Admin Panel" : "Панель управления"

	const animatedComponents = makeAnimated()

	const handleLangChange = (
		e: SingleValue<{ value: string; label: string }>
	) => {
		push(pathname, pathname, { locale: e?.value })
	}

	const logout = async () => {
		await push("auth/signin", "auth/signin", { locale })
		await signOut()
	}

	return (
		<header className="flex min-h-[84px] justify-between p-4 items-center text-white bg-primary border-b-2 border-b-secondary z-50 tablet:fixed tablet:w-full  ">
			<div className="flex gap-4 items-center">
				<Link
					locale={locale}
					href="/"
					className="flex gap-1 items-center"
				>
					<Image
						src={logo}
						alt="logo"
						className="w-12 h-12"
					/>
					<span className="tablet:hidden">{title}</span>
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
				<Select
					components={animatedComponents}
					onChange={(e) => handleLangChange(e)}
					styles={HeaderSelectStyle}
					value={{ value: locale!, label: locale!.toUpperCase() }}
					options={locales?.map((locale) => ({
						value: locale,
						label: locale.toUpperCase(),
					}))}
				/>
			</div>
		</header>
	)
}

export default Header
