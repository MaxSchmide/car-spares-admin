/* eslint-disable @next/next/no-img-element */
import { ICategory } from "@/models/category.model"
import {
  DefaultSelectStyle,
  HeaderSelectStyle,
  ProductPageSelectStyle,
} from "@/utils/main"
import { DocumentArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Select, { SingleValue } from "react-select"
import makeAnimated from "react-select/animated"
import { ReactSortable } from "react-sortablejs"
import { Spinner } from "./Spinner"

interface Props {
  title?: string
  description?: string
  price?: number
  category?: ICategory
  images?: string[]
  article?: string
  analogs?: string[]
  application?: string
  properties?: Object
  _id?: string
  brand?: string
}

const ProductForm = ({
  title,
  description,
  price,
  category: productCategory,
  images: productImages,
  article,
  analogs: productAnalogs,
  application,
  properties,
  brand,
  _id,
}: Props) => {
  const { push, locale } = useRouter()

  const [categories, setCategories] = useState<ICategory[]>([])
  const [images, setImages] = useState(
    productImages?.map((image) => ({ id: image, src: image })) || []
  )
  const [selectedProps, setSelectedProps] = useState<{ [key: string]: any }>(
    properties || {}
  )
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    productCategory || null
  )
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [details, setDetails] = useState({
    brand: brand || "",
    application: application || "",
    title: title || "",
    description: description || "",
    price: price || "",
    article: article || "",
    analogs: productAnalogs?.join(",") || "",
  })

  const engLanguage = locale === "en"
  const props = []

  const animatedComponents = makeAnimated()

  const selectCategories = (e: SingleValue<ICategory>) => {
    setSelectedCategory(e as ICategory)
  }

  const fetchCategories = async () => {
    const res = await axios.get("/api/categories")
    setCategories(res.data)
  }

  const selectProps = (
    e: SingleValue<{ label: any; value: any }>,
    name: string
  ) => {
    setSelectedProps((prev) => {
      const newProps = { ...prev }
      newProps[name] = e?.value
      return newProps
    })
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
    const assignedCategory = selectedCategory?._id
    const assignedImages = images.map((image) => image.src)
    const data = {
      ...details,
      analogs: details?.analogs?.split(","),
      images: assignedImages,
      category: assignedCategory,
      properties: selectedProps,
    }
    if (_id) {
      await axios
        .put("/api/products", {
          ...data,
          _id,
        })
        .then(() => {
          setIsLoading(false)
          push("/products", "/products", { locale })
          toast.success(engLanguage ? "Edited" : "Изменено")
        })
    } else {
      await axios.post("/api/products", data).then(() => {
        setIsLoading(false)
        push("/products", "/products", { locale })
        toast.success(engLanguage ? "Added" : "Добавлено")
      })
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (categories.length > 0 && selectedCategory) {
    let catInfo = categories.find(({ _id }) => _id === selectedCategory._id)
    props.push(...catInfo?.properties!)
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      )
      props.push(...parentCat?.properties!)
      catInfo = parentCat
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => saveProduct(e)}
        className="flex flex-col gap-4"
      >
        <div className="flex gap-8 mobile:flex-col mobile:gap-4">
          <div className="flex flex-col w-1/2 gap-2 mobile:w-full">
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
          </div>
          <div className="flex flex-col w-1/2 gap-2 mobile:w-full">
            <label htmlFor="brand">{engLanguage ? "Brand" : "Бренд"}</label>
            <input
              type="text"
              name="brand"
              id="brand"
              placeholder={engLanguage ? "Enter brand" : "Введите бренд"}
              value={details.brand}
              onChange={(e) => inputChangeHandler(e)}
              required
              className="input"
            />
          </div>
        </div>
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
          {engLanguage ? "Category" : "Категория"}
        </label>
        <Select
          placeholder={engLanguage ? "Select category" : "Выберите категорию"}
          instanceId={locale}
          required
          isClearable
          options={categories.map((c) => ({ ...c, value: c._id }))}
          styles={ProductPageSelectStyle}
          value={selectedCategory}
          components={animatedComponents}
          onChange={(e) => selectCategories(e)}
        />
        {categories.length > 0 && (
          <div className="grid grid-cols-2 gap-y-4 items-center mobile:flex-col mobile:gap-0">
            {props?.map((prop, i) => (
              <div
                key={prop.name}
                className="flex flex-col w-full gap-2 mobile:w-full "
              >
                <p className="w-full">{prop.name}:</p>
                <Select
                  styles={DefaultSelectStyle}
                  options={prop.values.map((v) => ({ label: v, value: v }))}
                  isClearable
                  isSearchable={false}
                  value={{
                    label: selectedProps[prop.name],
                    value: selectedProps[prop.name],
                  }}
                  classNames={{
                    container: () => "w-2/3",
                  }}
                  onChange={(e) => selectProps(e, prop.name)}
                />
              </div>
            ))}
          </div>
        )}

        <label htmlFor="application">
          {engLanguage ? "Application" : "Применение"}
        </label>
        <textarea
          name="application"
          id="application"
          placeholder={engLanguage ? "(Optional)" : "(Дополнительно)"}
          value={details.application}
          onChange={(e) => inputChangeHandler(e)}
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
        </div>
      </form>
    </>
  )
}

export default ProductForm
