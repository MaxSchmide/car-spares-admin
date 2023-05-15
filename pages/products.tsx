import Layout from "@/components/Layout"
import ModalDelete from "@/components/ModalDelete"
import { Spinner } from "@/components/Spinner"
import { IProduct } from "@/models/product.model"
import axios from "axios"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import {
	TrashIcon,
	PencilIcon,
	ChevronUpIcon,
	ChevronDownIcon,
	ChevronUpDownIcon,
} from "@heroicons/react/24/outline"

const ProductsPage = () => {
	const { status } = useSession()
	const router = useRouter()

	const [isLoading, setIsLoading] = useState(false)
	const [products, setProducts] = useState<IProduct[]>([])
	const [showModal, setShowModal] = useState(false)
	const [modalData, setModalData] = useState<IProduct>()
	const [order, setOrder] = useState<string>("asc")
	const [sortField, setSortField] = useState<string>("")

	const signedIn = status === "authenticated"

	const handleSortingChange = (accessor: string) => {
		const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc"
		setOrder(sortOrder)
		setSortField(accessor)
		if (accessor) {
			const sorted = [...products].sort((a, b) => {
				if (a[accessor] === null) return 1
				if (b[accessor] === null) return -1
				if (a[accessor] === null && b[accessor] === null) return 0
				return (
					a[accessor].toString().localeCompare(b[accessor].toString(), "en", {
						numeric: true,
					}) * (sortOrder === "asc" ? 1 : -1)
				)
			})
			setProducts(sorted)
		}
	}

	const getSortIcons = (accessor: string): any => {
		return sortField === accessor && order === "asc" ? (
			<ChevronUpIcon className="h-6 w-6 text-white" />
		) : sortField === accessor && order === "desc" ? (
			<ChevronDownIcon className="h-6 w-6 text-white" />
		) : (
			<ChevronUpDownIcon className="h-6 w-6 text-white" />
		)
	}

	const fetchProducts = useCallback(async () => {
		setIsLoading(true)
		await axios
			.get("/api/products")
			.then((res) => {
				setProducts(res.data)
				setIsLoading(false)
			})
			.catch((e) => {
				e.response.status === 403
					? router.push("auth/error?error=AccessDenied")
					: console.log(e)
			})
	}, [router])

	useEffect(() => {
		signedIn && fetchProducts()
	}, [fetchProducts, signedIn])

	const openModalToDelete = (product: IProduct) => {
		setModalData(product)
		setShowModal(true)
	}

	const deleteProduct = async () => {
		await axios.delete("/api/products?id=" + modalData?._id)
		fetchProducts()
	}

	return (
		<>
			{signedIn && (
				<Layout>
					<header className="mb-20">
						<Link
							href={"/products/new"}
							className="btn btn--secondary"
						>
							Add new product
						</Link>
					</header>
					<main>
						{!isLoading ? (
							products.length ? (
								<table className="basic">
									<thead>
										<tr>
											<td
												className="flex gap-2"
												onClick={() => handleSortingChange("title")}
											>
												Product Name
												{getSortIcons("title")}
											</td>
											<td>Category</td>
											<td></td>
										</tr>
									</thead>
									<tbody>
										{products.map((product) => (
											<tr key={product._id}>
												<td className="w-3/4">{product.title}</td>
												<td className="w-1/4">
													{product.categories.map((category) => (
														<p key={category._id}>{category.label}</p>
													))}
												</td>
												<td className="flex w-fit gap-2 items-center">
													<Link
														className="btn btn--success !p-2"
														href={"/products/edit/" + product._id}
													>
														<PencilIcon className="w-6 h-6" />
													</Link>
													<button
														onClick={() => openModalToDelete(product)}
														className="btn btn--danger !p-2"
													>
														<TrashIcon className="w-6 h-6" />
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<h1> No products are aviable</h1>
							)
						) : (
							<Spinner size={10} />
						)}
					</main>
					<ModalDelete
						show={showModal}
						onClose={() => setShowModal(false)}
						onDelete={deleteProduct}
						product={modalData}
					/>
				</Layout>
			)}
		</>
	)
}

export default ProductsPage
