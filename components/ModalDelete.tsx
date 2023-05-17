import { IAdmin } from "@/models/admin.model"
import { ICategory } from "@/models/category.model"
import { IProduct } from "@/models/product.model"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"

type ModalProps = {
	show: boolean
	onClose: () => void
	onDelete: () => void
	product?: IProduct
	category?: ICategory
	admin?: IAdmin
}

function ModalDelete({
	show,
	onClose,
	onDelete,
	product,
	category,
	admin,
}: ModalProps) {
	const { locale } = useRouter()

	const [isBrowser, setIsBrowser] = useState(false)

	const engLanguage = locale === "en"

	const title = product
		? product.title
		: category
		? category?.label
		: admin?.email

	const handleCloseClick = (e: React.MouseEvent) => {
		e.preventDefault()
		onClose()
	}

	const deleteData = () => {
		onDelete()
		onClose()
	}

	useEffect(() => {
		setIsBrowser(true)
	}, [])

	const modalContent = show ? (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50  duration-100 z-0">
			<div className="bg-white max-w-4/5 max-h-4/5 rounded-xl px-10 py-8 w-auto h-auto z-20 animate-zoom-in">
				<div
					id="head"
					className="text-center mb-8"
				>
					<h1>
						{engLanguage ? "You want to delete:" : "Вы хотите удалить:"}
						&nbsp;
						<b>{title}</b>
					</h1>
					<p> {engLanguage ? "Are you sure?" : "Вы уверены?"}</p>
				</div>
				<div
					id="body"
					className="flex justify-center items-center gap-6"
				>
					<button
						className="btn btn--danger"
						onClick={deleteData}
					>
						{engLanguage ? "Yes" : "Да"}
					</button>
					<button
						onClick={handleCloseClick}
						className="btn btn--primary"
					>
						{engLanguage ? "No" : "Нет"}
					</button>
				</div>
			</div>
		</div>
	) : null

	if (isBrowser) {
		return ReactDOM.createPortal(
			modalContent,
			document.getElementById("modal-root")!
		)
	} else {
		return null
	}
}

export default ModalDelete
