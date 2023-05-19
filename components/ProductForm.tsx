/* eslint-disable @next/next/no-img-element */
import { ICategory } from "@/models/category.model"
import { ProductPageSelectStyle } from "@/utils/main"
import { DocumentArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Select, { MultiValue } from "react-select"
import makeAnimated from "react-select/animated"
import { ReactSortable } from "react-sortablejs"
import { Spinner } from "./Spinner"

interface Props {
	title?: string
	description?: string
	price?: number
	categories?: ICategory[]
	images?: string[]
	article?: string
	analogs?: string[]
	_id?: string
}

const ProductForm = ({
	title,
	description,
	price,
	categories: productCategories,
	images: productImages,
	article,
	analogs: productAnalogs,
	_id,
}: Props) => {
	const { push, locale } = useRouter()

	const [categories, setCategories] = useState<ICategory[]>([])
	const [images, setImages] = useState(
		productImages?.map((image) => ({ id: image, src: image })) || []
	)
	const [selectedCategories, setSelectedCategories] = useState<ICategory[]>(
		productCategories || []
	)
	const [isUploading, setIsUploading] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [details, setDetails] = useState({
		title: title || "",
		description: description || "",
		price: price || "",
		article: article || "",
		analogs: productAnalogs?.join(",") || "",
	})

	const engLanguage = locale === "en"

	const animatedComponents = makeAnimated()

	const selectCategories = (e: MultiValue<ICategory>) => {
		setSelectedCategories(e.map((c) => c))
	}

	const fetchCategories = async () => {
		const res = await axios.get("/api/categories")
		setCategories(res.data)
	}

	const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!!files?.length) {
			setIsUploading(true)
			const data = new FormData()
			for (const file of files) {
				data.append("file", file)
			}
			await axios.post("/api/upload", data).then((res) => {
				setImages((prev) => {
					return [
						...prev,
						...res.data.links.map((link: string) => ({ id: link, src: link })),
					]
				})
				setIsUploading(false)
			})
		}
	}

	const deleteImage = async (img: string) => {
		await axios
			.delete("/api/delete?id=" + img)
			.then(() => setImages((prev) => prev.filter((item) => item.id !== img)))
	}

	const inputChangeHandler = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setDetails((prev) => {
			return { ...prev, [e.target.name]: e.target.value }
		})
	}

	const saveProduct = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		const assignedCategories = selectedCategories.map((c) => c._id)
		const assignedImages = images.map((image) => image.src)
		const data = {
			...details,
			analogs: details?.analogs?.split(","),
			images: assignedImages,
			categories: assignedCategories,
		}
		if (_id) {
			await axios
				.put("/api/products", {
					...data,
					_id,
				})
				.then(() => {
					toast.success(engLanguage ? "Edited" : "Изменено")
					setIsLoading(false)
					push("/products", "/products", { locale })
				})
		} else {
			await axios.post("/api/products", data).then(() => {
				toast.success(engLanguage ? "Added" : "Добавлено")
				setIsLoading(false)
				push("/products", "/products", { locale })
			})
		}
	}

	useEffect(() => {
		fetchCategories()
	}, [])

	return (
		<>
			<form
				onSubmit={(e) => saveProduct(e)}
				className="flex flex-col gap-4"
			>
				<label htmlFor="title">
					{engLanguage ? "Product name" : "Название товара"}
				</label>
				<input
					type="text"
					name="title"
					id="title"
					placeholder={engLanguage ? "Enter title" : "Введите название"}
					value={details.title}
					onChange={(e) => inputChangeHandler(e)}
					required
					className="input"
				/>
				<div className="flex flex-col gap-4 mb-4">
					<div className="flex gap-2 items-center">
						<label htmlFor="article">
							{engLanguage ? "Article:" : "Артикль:"}
						</label>
						<input
							type="text"
							name="article"
							id="article"
							placeholder={
								engLanguage ? "Enter article number" : "Введите номер"
							}
							value={details.article}
							onChange={(e) => inputChangeHandler(e)}
							required
							className="input w-full !mb-0"
						/>
					</div>
					<div className="flex gap-2 items-center">
						<label htmlFor="analogs">
							{engLanguage ? "Analogs:" : "Аналоги:"}
						</label>
						<input
							type="text"
							name="analogs"
							id="analogs"
							placeholder={engLanguage ? "Coma separated" : "Через запятую"}
							value={details.analogs}
							onChange={(e) => inputChangeHandler(e)}
							required
							className="input w-full !mb-0"
						/>
					</div>
				</div>
				<label htmlFor="categories">
					{engLanguage ? "Categories" : "Категории"}
				</label>
				<Select
					placeholder={engLanguage ? "Select categories" : "Выберите категории"}
					required
					options={categories.map((c) => ({ ...c, value: c._id }))}
					styles={ProductPageSelectStyle}
					closeMenuOnSelect={false}
					value={selectedCategories?.map((c) => ({ ...c, value: c._id }))}
					components={animatedComponents}
					isMulti
					onChange={(e) => selectCategories(e)}
				/>
				<label htmlFor="description">
					{engLanguage ? "Product Description" : "Описание товара"}
				</label>
				<textarea
					name="description"
					id="description"
					placeholder={engLanguage ? "(Optional)" : "(Дополнительно)"}
					value={details.description}
					onChange={(e) => inputChangeHandler(e)}
				/>
				<div className="flex flex-wrap gap-4 mobile:justify-center">
					{!!images.length && (
						<ReactSortable
							className="flex flex-wrap gap-4 mobile:justify-center"
							list={images}
							setList={setImages}
						>
							{images.map((img) => (
								<div
									key={img.id}
									className="relative group"
								>
									<img
										src={img.src}
										alt="product image"
										className="mobile:w-[8rem] mobile:h-[8rem] w-[10rem] h-[10rem] object-cover rounded-md shadow-md group-hover:brightness-50"
									/>
									<span
										className="absolute cursor-pointer top-1 right-1 inline-block -translate-y-10 duration-200 opacity-0 mobile:translate-y-0 mobile:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
										onClick={() => deleteImage(img.id)}
									>
										<XMarkIcon className="w-6 h-6 text-white" />
									</span>
								</div>
							))}
						</ReactSortable>
					)}
					{isUploading && (
						<div className="flex items-center justify-center p-4">
							<Spinner />
						</div>
					)}
					<label
						htmlFor="photos"
						className="hover:border-secondaryTint duration-200 bg-transparent w-fit flex flex-col gap-4  items-center border-grey2 border-2 px-8 py-10 rounded-md shadow-md mobile:px-4 mobile:py-4"
					>
						<DocumentArrowUpIcon className="w-10 h-10  text-secondary" />
						{engLanguage ? "Upload photos" : "Загрузите фото"}
						<input
							className="hidden"
							type="file"
							name="photos"
							id="photos"
							multiple
							onChange={(e) => uploadImages(e)}
							accept="image/*"
						/>
					</label>
				</div>
				<label htmlFor="price">
					{engLanguage ? "Product Price" : "Цена товара"}
				</label>
				<input
					type="number"
					name="price"
					id="price"
					placeholder="USD"
					value={details.price}
					onChange={(e) => inputChangeHandler(e)}
					required
					className="input"
				/>
				<div className="flex gap-8">
					{isLoading ? (
						<button
							type="submit"
							className="w-1/5 mobile:w-1/2 !flex items-center justify-center btn btn--load"
							disabled
						>
							<Spinner />
						</button>
					) : (
						<button
							type="submit"
							className="w-1/5 mobile:w-1/2 btn btn--secondary"
						>
							{engLanguage ? "SAVE" : "ГОТОВО"}
						</button>
					)}
					{details && (
						<button
							type="button"
							className="w-1/6 mobile:w-1/2 btn btn--primary"
							onClick={() => push("/products", "/products", { locale })}
						>
							{engLanguage ? "Cancel" : "Отмена"}
						</button>
					)}
				</div>
			</form>
		</>
	)
}

export default ProductForm
