import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import {
	QueueListIcon,
	ListBulletIcon,
	CreditCardIcon,
	Cog6ToothIcon,
	CircleStackIcon,
} from "@heroicons/react/24/outline"

type Props = {
	isShow: boolean
	show: () => void
}

const Sidebar = ({ isShow, show }: Props) => {
	const { pathname, locale } = useRouter()

	const engLanguage = locale === "en"

	const inactiveLink =
		"flex gap-1 p-4 pl-8 hover:bg-primaryTint hover:text-white"

	const activeLink =
		inactiveLink + " bg-primaryThin text-white border-l-white border-l-4"

	return (
		<>
			<aside
				className={`w-1/5 bg-primary text-grey2 pt-8 duration-200 overflow-scroll scrollbar fixed top-[84px] left-0 h-screen z-50 mobile:!w-1/2 tablet:w-1/3  ${
					isShow ? "-translate-x-0" : "-translate-x-[100%]"
				}`}
			>
				<nav className="flex flex-col gap-4 ">
					<Link
						locale={locale}
						href="/"
						className={pathname === "/" ? activeLink : inactiveLink}
					>
						<CircleStackIcon className="w-6 h-6" />
						{engLanguage ? "Dashboard" : "Статистика"}
					</Link>

					<Link
						locale={locale}
						href="/orders"
						className={pathname.includes("/orders") ? activeLink : inactiveLink}
					>
						<CreditCardIcon className="w-6 h-6" />
						{engLanguage ? "Orders" : "Заказы"}
					</Link>
					<Link
						locale={locale}
						href="/products"
						className={
							pathname.includes("/products") ? activeLink : inactiveLink
						}
					>
						<ListBulletIcon className="w-6 h-6" />
						{engLanguage ? "Products" : "Товары"}
					</Link>
					<Link
						locale={locale}
						href="/categories"
						className={
							pathname.includes("/categories") ? activeLink : inactiveLink
						}
					>
						<QueueListIcon className="h-6 w-6" />
						{engLanguage ? "Categories" : "Категории"}
					</Link>
					<Link
						locale={locale}
						href="/settings"
						className={
							pathname.includes("/settings") ? activeLink : inactiveLink
						}
					>
						<Cog6ToothIcon className="w-6 h-6" />
						{engLanguage ? "Settings" : "Настройки"}
					</Link>
				</nav>
			</aside>
			<div
				onClick={show}
				className={` ${
					isShow ? "block" : "hidden"
				} fixed inset-0 bg-black bg-opacity-40 z-20 `}
			/>
		</>
	)
}

export default Sidebar
