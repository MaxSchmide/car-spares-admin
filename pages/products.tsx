import Layout from "@/components/Layout"
import ModalDelete from "@/components/ModalDelete"
import { Spinner } from "@/components/Spinner"
import { IProduct } from "@/models/product.model"
import {
	ChevronDownIcon,
	ChevronUpDownIcon,
	ChevronUpIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/outline"
import axios from "axios"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const ProductsPage = () => {
	const { push, locale } = useRouter()

	const [isLoading, setIsLoading] = useState(false)
	const [products, setProducts] = useState<IProduct[]>([])
	const [showModal, setShowModal] = useState(false)
	const [modalData, setModalData] = useState<IProduct>()
	const [order, setOrder] = useState<string>("asc")
	const [sortField, setSortField] = useState<string>("")
	const [filterValue, setFilterValue] = useState("")

	const engLanguage = locale === "en"

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
					? push("auth/error?error=AccessDenied")
					: toast.error(
							engLanguage ? "Something went wrong" : "Что-то пошло не так"
					  )
			})
	}, [push, engLanguage])

	const openModalToDelete = (product: IProduct) => {
		setModalData(product)
		setShowModal(true)
	}

	const deleteProduct = async () => {
		await axios.delete("/api/products?id=" + modalData?._id).catch((e) => {
			console.log(e)
			toast.error(
				engLanguage
					? "Something went wrong! Please try again"
					: "Что-то пошло не так... Попробуйте снова"
			)
		})
		fetchProducts()
	}

	useEffect(() => {
		fetchProducts()
	}, [fetchProducts])

	return (
		<Layout>
			<main>
				<header className="mb-20 flex justify-between items-center mobile:flex-col-reverse mobile:gap-8 ">
					<input
						type="text"
						className="input !mb-0 w-1/3 mobile:!w-full tablet:w-1/2 "
						placeholder={
							engLanguage ? "Filter by category..." : "Фильтр по категориям"
						}
						value={filterValue}
						onChange={(e) => setFilterValue(e.target.value)}
					/>
					<Link
						locale={locale}
						href={"/products/new"}
						className="w-fit btn btn--secondary"
					>
						{engLanguage ? "Add new product" : "Добавить новый"}
					</Link>
				</header>
				{!isLoading ? (
					products.length ? (
						<table className="basic">
							<thead>
								<tr>
									<td>
										<span
											className="flex gap-2 select-none cursor-pointer"
											onClick={() => handleSortingChange("title")}
										>
											{engLanguage ? "Product Name" : "Название"}
											{getSortIcons("title")}
										</span>
									</td>
									<td>
										<span
											className="flex gap-2 select-none cursor-pointer"
											onClick={() => handleSortingChange("article")}
										>
											{engLanguage ? "Article" : "Артикль"}
											{getSortIcons("article")}
										</span>
									</td>
									<td className="mobile:hidden">
										{engLanguage ? "Category" : "Категория"}
									</td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								{products
									.filter((prod) => {
										if (prod.category) {
											return (
												prod.category.label
													.toLowerCase()
													.includes(filterValue.toLowerCase()) && prod
											)
										} else return !filterValue && prod
									})
									.map((product) => (
										<tr key={product._id}>
											<td>
												<span
													className="inline-block select-none cursor-pointer"
													onDoubleClick={() =>
														push(
															"/products/edit/" + product._id,
															"/products/edit/" + product._id,
															{ locale }
														)
													}
												>
													{product.title}
												</span>
											</td>
											<td>{product.article}</td>
											<td className="mobile:hidden">
												{product.category?.label}
											</td>
											<td>
												<span className="flex w-fit gap-2 items-center ml-auto">
													<Link
														className="btn btn--success !p-2"
														href={"/products/edit/" + product._id}
														locale={locale}
													>
														<PencilIcon className="w-6 h-6" />
													</Link>
													<button
														onClick={() => openModalToDelete(product)}
														className="btn btn--danger !p-2"
													>
														<TrashIcon className="w-6 h-6" />
													</button>
												</span>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					) : (
						<h1>
							{engLanguage ? "No products are aviable" : "Товары не найдены"}
						</h1>
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
	)
}

export const getServerSideProps = async (context: any) => {
	const { req, defaultLocale } = context
	const session = await getSession({ req })
	if (!session) {
		return {
			redirect: {
				destination: `${defaultLocale}/auth/signin`,
			},
		}
	}
	return {
		props: {},
	}
}

export default ProductsPage
