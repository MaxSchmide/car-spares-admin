import Layout from "@/components/Layout"
import ModalDelete from "@/components/ModalDelete"
import { IAdmin } from "@/models/admin.model"
import axios from "axios"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const SettingPage = () => {
	const { data: session } = useSession()
	const [adminEmail, setAdminEmail] = useState("")
	const [admins, setAdmins] = useState<IAdmin[]>([])
	const [modalData, setModalData] = useState<IAdmin>()
	const [showModal, setShowModal] = useState(false)

	const addAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const data = { email: adminEmail, role: "admin" }
		await axios.post("/api/admins", data).then(() => {
			setAdminEmail("")
			toast.success("Added")
		})
	}

	const deleteAdmin = async () => {
		await axios.delete("/api/admins?_id=" + modalData?._id)
		fetchAdmins()
	}

	const openModalToDelete = (admin: IAdmin) => {
		setModalData(admin)
		setShowModal(true)
	}

	const fetchAdmins = async () => {
		const res = await axios.get("/api/admins")
		setAdmins(res.data)
	}
	useEffect(() => {
		fetchAdmins()
	}, [])

	return (
		<Layout>
			{session?.user.role === "owner" && (
				<>
					<h1 className="mb-2 text-2xl"> Add new Admin</h1>
					<form
						onSubmit={addAdmin}
						className="flex gap-2 items-center mb-24"
					>
						<input
							pattern="(\W|^)[\w.+\-]*@gmail\.com(\W|$)"
							placeholder="example@gmail.com"
							type="email"
							className="input w-full !mb-0"
							value={adminEmail}
							onChange={(e) => setAdminEmail(e.target.value)}
						/>
						<button
							type="submit"
							className="btn btn--secondary"
						>
							Save
						</button>
					</form>
				</>
			)}
			<h1 className="mb-4 text-2xl">Admins</h1>
			<table className="basic">
				<thead>
					<tr>
						<td>E-mail</td>
						<td>Role</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{admins.map((admin) => (
						<tr key={admin.email}>
							<td className="w-2/3">{admin.email}</td>
							<td className="w-1/3">{admin.role}</td>
							<td>
								{session?.user.role === "owner" && (
									<button
										onClick={() => openModalToDelete(admin)}
										className="btn btn--danger !p-2"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
											/>
										</svg>
									</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<ModalDelete
				show={showModal}
				onClose={() => setShowModal(false)}
				onDelete={deleteAdmin}
				admin={modalData}
			/>
		</Layout>
	)
}

export default SettingPage
