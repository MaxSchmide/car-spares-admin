/* eslint-disable @next/next/no-img-element */
import { ProductPageSelectStyle } from "@/utils/main"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Select, { MultiValue } from "react-select"
import makeAnimated from "react-select/animated"
import { ReactSortable } from "react-sortablejs"
import { Spinner } from "./Spinner"
import { ICategory } from "@/models/category.model"
import { XMarkIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline"
import { IProduct } from "@/models/product.model"

const initialState = {
	title: "",
	description: "",
	price: 0,
	article: "",
	analogs: "",
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
}: IProduct) => {
	const [categories, setCategories] = useState<ICategory[]>([])
	const [images, setImages] = useState<string[]>(productImages || [])
	const [selectedCategories, setSelectedCategories] = useState<ICategory[]>(
		productCategories || []
	)
	const [isUploading, setIsUploading] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [details, setDetails] = useState(
		{ title, description, price, article, analogs: productAnalogs.join(",") } ||
			initialState
	)
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
			const res = await axios.post("/api/upload", data)
			setImages((prev) => {
				return [...prev, ...res.data.links]
			})
			setIsUploading(false)
		}
	}

	const deleteImage = async (img: string) => {
		const res = await axios.delete("/api/delete?id=" + img)
		setImages((prev) => [...prev.filter((item) => item !== img)])
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
		const data = {
			...details,
			analogs: details.analogs.split(","),
			images,
			categories: assignedCategories,
		}
		if (_id) {
			await axios
				.put("/api/products", {
					...data,
					_id,
				})
				.then(() => {
					toast.success("Edited")
					setIsLoading(false)
				})
		} else {
			await axios.post("/api/products", data).then(() => {
				toast.success("Added")
				setSelectedCategories([])
				setImages([])
				setDetails(initialState)
				setIsLoading(false)
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
				<label htmlFor="title">Product Name</label>
				<input
					type="text"
					name="title"
					id="title"
					placeholder="Enter title"
					value={details.title}
					onChange={(e) => inputChangeHandler(e)}
					required
					className="input"
				/>
				<div className="flex flex-col gap-4 mb-4">
					<div className="flex gap-2 items-center">
						<label htmlFor="article">Article: </label>
						<input
							type="text"
							name="article"
							id="article"
							placeholder="Enter article number"
							value={details.article}
							onChange={(e) => inputChangeHandler(e)}
							required
							className="input w-full !mb-0"
						/>
					</div>
					<div className="flex gap-2 items-center">
						<label htmlFor="analogs">Analogs: </label>
						<input
							type="text"
							name="analogs"
							id="analogs"
							placeholder="Coma separated **,**"
							value={details.analogs}
							onChange={(e) => inputChangeHandler(e)}
							required
							className="input w-full !mb-0"
						/>
					</div>
				</div>
				<label htmlFor="categories">Categories</label>
				<Select
					required
					options={categories.map((c) => ({ ...c, value: c._id }))}
					styles={ProductPageSelectStyle}
					closeMenuOnSelect={false}
					value={selectedCategories?.map((c) => ({ ...c, value: c._id }))}
					components={animatedComponents}
					isMulti
					onChange={(e) => selectCategories(e)}
				/>
				<label htmlFor="description">Product Description</label>
				<textarea
					name="description"
					id="description"
					placeholder="Optional"
					value={details.description}
					onChange={(e) => inputChangeHandler(e)}
				/>
				<div className="flex flex-wrap gap-4">
					{!!images.length && (
						<ReactSortable
							className="flex flex-wrap gap-4"
							list={images}
							setList={setImages}
						>
							{images.map((img) => (
								<div
									key={img}
									className="relative group"
								>
									<img
										src={img}
										alt="product image"
										className="w-[10rem] h-[10rem] object-cover rounded-md shadow-md group-hover:brightness-50"
									/>
									<span
										className="absolute cursor-pointer top-1 right-1 inline-block -translate-y-10 duration-200 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
										onClick={() => deleteImage(img)}
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
						className="hover:border-secondaryTint duration-200 bg-transparent w-fit flex flex-col gap-4  items-center border-grey2 border-2 px-8 py-10 rounded-md shadow-md"
					>
						<DocumentArrowUpIcon className="w-10 h-10 text-secondary" />
						Upload photos
						<input
							className="hidden"
							type="file"
							name="photos"
							id="photos"
							multiple
							onChange={(e) => uploadImages(e)}
						/>
					</label>
				</div>
				<label htmlFor="price">Product Price</label>
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
				{isLoading ? (
					<button
						type="submit"
						className="w-1/5 flex items-center justify-center btn btn--load"
						disabled
					>
						<Spinner />
					</button>
				) : (
					<button
						type="submit"
						className="w-1/5 btn btn--secondary"
					>
						SAVE
					</button>
				)}
			</form>
		</>
	)
}

export default ProductForm
