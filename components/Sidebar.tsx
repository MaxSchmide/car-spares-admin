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
const Sidebar = () => {
	const { pathname } = useRouter()

	const inactiveLink =
		"flex gap-1 p-4 pl-8 hover:bg-primaryTint hover:text-white"

	const activeLink =
		inactiveLink + " bg-primaryThin text-white border-l-white border-l-4"

	return (
		<aside className="w-1/5 bg-primary text-grey2 pt-8">
			<nav className="flex flex-col gap-4">
				<Link
					href="/"
					className={pathname === "/" ? activeLink : inactiveLink}
				>
					<CircleStackIcon className="w-6 h-6" />
					Dashboard
				</Link>
				<Link
					href="/orders"
					className={pathname.includes("/orders") ? activeLink : inactiveLink}
				>
					<CreditCardIcon className="w-6 h-6" />
					Orders
				</Link>
				<Link
					href="/products"
					className={pathname.includes("/products") ? activeLink : inactiveLink}
				>
					<ListBulletIcon className="w-6 h-6" />
					Products
				</Link>
				<Link
					href="/categories"
					className={
						pathname.includes("/categories") ? activeLink : inactiveLink
					}
				>
					<QueueListIcon className="h-6 w-6" />
					Categories
				</Link>
				<Link
					href="/settings"
					className={pathname.includes("/settings") ? activeLink : inactiveLink}
				>
					<Cog6ToothIcon className="w-6 h-6" />
					Settings
				</Link>
			</nav>
		</aside>
	)
}

export default Sidebar
