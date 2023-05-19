import Layout from "@/components/Layout"
import ModalDelete from "@/components/ModalDelete"
import { Spinner } from "@/components/Spinner"
import { ICategory } from "@/models/category.model"
import { CategoriesPageSelectStyle } from "@/utils/main"
import {
	ChevronDownIcon,
	ChevronUpDownIcon,
	ChevronUpIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/outline"
import axios from "axios"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Select, { SingleValue } from "react-select"
import makeAnimated from "react-select/animated"

const CategoriesPage = () => {
	const { push, locale } = useRouter()

	const [categories, setCategories] = useState<ICategory[]>([])
	const [isFetching, setIsFetching] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
		null
	)
	const [modalData, setModalData] = useState<ICategory>()
	const [showModal, setShowModal] = useState(false)
	const [categoryTitle, setCategoryTitle] = useState("")
	const [editedCategory, setEditedCategory] = useState<ICategory | null>(null)
	const [order, setOrder] = useState<string>("asc")
	const [sortField, setSortField] = useState<string>("")

	const animatedComponents = makeAnimated()
	const engLanguage = locale === "en"
	const title = editedCategory ? (
		engLanguage ? (
			<>
				Edit category: <strong>{editedCategory.label}</strong>
			</>
		) : (
			<>
				Изменить категорию: <strong>{editedCategory.label}</strong>
			</>
		)
	) : engLanguage ? (
		"Add new category"
	) : (
		"Добавить категорию"
	)

	const handleSortingChange = (accessor: string) => {
		const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc"
		setOrder(sortOrder)
		setSortField(accessor)
		if (accessor) {
			const sorted = [...categories].sort((a, b) => {
				if (a[accessor] === null) return 1
				if (b[accessor] === null) return -1
				if (a[accessor] === null && b[accessor] === null) return 0
				return (
					a[accessor].toString().localeCompare(b[accessor].toString(), "en", {
						numeric: true,
					}) * (sortOrder === "asc" ? 1 : -1)
				)
			})
			setCategories(sorted)
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

	const selectCategory = (e: SingleValue<ICategory>) => {
		console.log(e)
		setSelectedCategory(e)
	}

	const deleteCategory = async () => {
		await axios.delete("/api/categories?id=" + modalData?._id).catch((e) => {
			console.log(e)
			toast.error(
				engLanguage
					? "Something went wrong! Please try again"
					: "Что-то пошло не так... Попробуйте снова"
			)
		})
		fetchCategories()
	}

	const editCategory = async (category: ICategory) => {
		const parentCategory = category.parent
			? {
					_id: category?.parent?._id,
					label: category?.parent?.label,
					__v: category?.parent?.__v,
			  }
			: null
		setEditedCategory(category)
		setCategoryTitle(category.label)
		setSelectedCategory(parentCategory)
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	const cleanCategoryForm = () => {
		setEditedCategory(null)
		setCategoryTitle("")
		setSelectedCategory(null)
	}

	const saveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsPending(true)

		const data = {
			label: categoryTitle,
			parent: selectedCategory?._id,
		}

		editedCategory
			? await axios
					.put("/api/categories", { ...data, _id: editedCategory._id })
					.then(() => {
						cleanCategoryForm()
						setIsPending(false)
						toast.success(engLanguage ? "Edited" : "Изменено")
					})
					.catch((e) => {
						toast.error(
							engLanguage ? "Something went wrong" : "Что-то пошло не так..."
						)
						setIsPending(false)
					})
			: await axios
					.post("/api/categories", data)
					.then(() => {
						cleanCategoryForm()
						setIsPending(false)
						toast.success(engLanguage ? "Added" : "Добавлено")
					})
					.catch((e) => {
						toast.error(
							engLanguage ? "Something went wrong" : "Что-то пошло не так..."
						)
						setIsPending(false)
					})

		fetchCategories()
	}

	const openModalToDelete = (category: ICategory) => {
		setModalData(category)
		setShowModal(true)
	}

	const fetchCategories = useCallback(async () => {
		setIsFetching(true)
		await axios
			.get("/api/categories")
			.then((res) => {
				setCategories(res.data)
				setIsFetching(false)
			})
			.catch((e) => {
				e.response.status === 403
					? push("auth/error?error=AccessDenied")
					: console.log(e)
			})
	}, [push])

	useEffect(() => {
		fetchCategories()
	}, [fetchCategories])

	return (
		<Layout>
			<main>
				<h2 className="mb-2">{title}</h2>
				<form
					onSubmit={(e) => saveCategory(e)}
					className="mb-10 w-full flex items-center gap-8 mobile:flex-col"
				>
					<div className="input !py-1 !pr-0 w-full !mb-0 flex">
						<input
							required
							className="bg-transparent  outline-none w-3/4 mobile:w-1/2"
							placeholder={
								engLanguage ? "Enter category name..." : "Введите название"
							}
							type="text"
							id="category"
							value={categoryTitle}
							onChange={(e) => setCategoryTitle(e.target.value)}
						/>
						<Select
							options={categories.map((cat) => {
								return { ...cat, value: cat._id }
							})}
							components={animatedComponents}
							styles={CategoriesPageSelectStyle}
							value={selectedCategory}
							placeholder={engLanguage ? "Parent..." : "Корневая..."}
							isClearable
							onChange={(e) => selectCategory(e)}
							classNames={{
								container: () => "mobile:!w-1/2",
							}}
						/>
					</div>
					<div
						className={`w-1/6 flex mobile:!w-full mobile:justify-center ${
							editedCategory && "flex !w-1/2 gap-2  mobile:justify-around"
						}`}
					>
						{isPending ? (
							<button
								type="submit"
								className={`w-full ${
									editedCategory && "!w-1/2"
								} mobile:!w-1/2  btn btn--load flex items-center justify-center`}
								disabled
							>
								<Spinner size={6} />
							</button>
						) : (
							<button
								type="submit"
								className={`w-full ${
									editedCategory && "!w-1/2"
								} mobile:!w-1/2  btn btn--secondary`}
							>
								{engLanguage ? "Save" : "Готово"}
							</button>
						)}
						{editedCategory && (
							<button
								onClick={cleanCategoryForm}
								type="button"
								className="w-1/2 btn btn--primary"
							>
								{engLanguage ? "Cancel" : "Отмена"}
							</button>
						)}
					</div>
				</form>
				{!isFetching ? (
					categories.length ? (
						<table className="basic">
							<thead>
								<tr>
									<td
										className="flex gap-2"
										onClick={() => handleSortingChange("label")}
									>
										{engLanguage ? "Name" : "Название"}
										{getSortIcons("label")}
									</td>
									<td className="mobile:hidden">
										{engLanguage ? "Parent category" : "Корневая категория"}
									</td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								{categories.map((category) => (
									<tr key={category._id}>
										<td className="w-1/2 mobile:w-full ">
											<span
												className="inline-block select-none cursor-pointer"
												onDoubleClick={() => editCategory(category)}
											>
												{category.label}
											</span>
										</td>
										<td className="w-1/2 mobile:hidden">
											{category.parent?.label}
										</td>
										<td className="flex w-fit gap-2 items-center">
											<button
												className="btn btn--success !p-2"
												onClick={() => editCategory(category)}
											>
												<PencilIcon className="w-6 h-6" />
											</button>
											<button
												onClick={() => openModalToDelete(category)}
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
						<h1>
							{engLanguage
								? "No categories are aviable"
								: "Категорий не найдено"}
						</h1>
					)
				) : (
					<Spinner size={10} />
				)}
				<ModalDelete
					show={showModal}
					onClose={() => setShowModal(false)}
					onDelete={deleteCategory}
					category={modalData}
				/>
			</main>
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

export default CategoriesPage
