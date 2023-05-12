import { IProduct } from "@/models/product.model"
import axios from "axios"
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"

type ModalProps = {
	show: boolean
	onClose: () => void
	product?: IProduct
}

function ModalDelete({ show, onClose, product }: ModalProps) {
	const [isBrowser, setIsBrowser] = useState(false)

	useEffect(() => {
		setIsBrowser(true)
	}, [])

	const handleCloseClick = (e: React.MouseEvent) => {
		e.preventDefault()
		onClose()
	}

	const deleteProduct = async (e: React.MouseEvent) => {
		await axios.delete("/api/products?id=" + product?._id)
		onClose()
	}

	const modalContent = show ? (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-0">
			<div className="bg-white max-w-4/5 max-h-4/5 rounded-xl p-4 w-auto h-auto z-20">
				<div
					id="head"
					className="text-center mb-8"
				>
					<h1>
						You want to delete: <b>{product?.title}</b>
					</h1>
					<p>Are you sure?</p>
				</div>
				<div
					id="body"
					className="flex justify-center items-center gap-6"
				>
					<button
						className="btn btn--danger"
						onClick={deleteProduct}
					>
						Yes
					</button>
					<button
						onClick={handleCloseClick}
						className="btn btn--primary"
					>
						No
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
