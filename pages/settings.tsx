import Layout from "@/components/Layout"
import ModalDelete from "@/components/ModalDelete"
import { Spinner } from "@/components/Spinner"
import { IAdmin } from "@/models/admin.model"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { TrashIcon } from "@heroicons/react/24/outline"
import { traceDeprecation } from "process"

const SettingPage = () => {
	const { data: session, status } = useSession()
	const router = useRouter()

	const [adminEmail, setAdminEmail] = useState("")
	const [admins, setAdmins] = useState<IAdmin[]>([])
	const [modalData, setModalData] = useState<IAdmin>()
	const [showModal, setShowModal] = useState(false)
	const [isPending, setIsPending] = useState(false)

	const signedIn = status === "authenticated"

	const addAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsPending(true)
		const data = { email: adminEmail, role: "admin" }
		await axios.post("/api/admins", data).then(() => {
			setAdminEmail("")
			setIsPending(false)
			toast.success("Added")
		})
		fetchAdmins()
	}

	const deleteAdmin = async () => {
		await axios.delete("/api/admins?_id=" + modalData?._id)
		fetchAdmins()
	}

	const openModalToDelete = (admin: IAdmin) => {
		setModalData(admin)
		setShowModal(true)
	}

	const fetchAdmins = useCallback(async () => {
		await axios
			.get("/api/admins")
			.then((res) => setAdmins(res.data))
			.catch((e) => {
				e.response.status === 403
					? router.push("auth/error?error=AccessDenied")
					: console.log(e)
			})
	}, [router])

	useEffect(() => {
		signedIn && fetchAdmins()
	}, [fetchAdmins, signedIn])

	return (
		<>
			{signedIn && (
				<Layout>
					{session?.user.role === "owner" && (
						<>
							<h1 className="mb-2 text-2xl"> Add new Admin</h1>
							<form
								onSubmit={addAdmin}
								className="flex gap-2 items-center mb-24 mobile:flex-col mobile:gap-4 mobile:mb-12"
							>
								<input
									pattern="(\W|^)[\w.+\-]*@gmail\.com(\W|$)"
									placeholder="example@gmail.com"
									type="email"
									className="input w-full !mb-0"
									value={adminEmail}
									onChange={(e) => setAdminEmail(e.target.value)}
								/>
								{isPending ? (
									<button
										type="submit"
										className="mobile:w-1/3 btn btn--load flex items-center justify-center"
										disabled
									>
										<Spinner size={6} />
									</button>
								) : (
									<button
										type="submit"
										className=" mobile:w-1/3 btn btn--secondary"
									>
										Save
									</button>
								)}
							</form>
						</>
					)}
					<h1 className="mb-4 text-2xl">Admins</h1>
					<table className="basic">
						<thead>
							<tr>
								<td>E-mail</td>
								<td className="mobile:hidden">Role</td>
								{session?.user.role === "owner" && <td></td>}
							</tr>
						</thead>
						<tbody>
							{admins.map((admin) => (
								<tr key={admin.email}>
									<td className="w-2/3 mobile:overflow-hidden">
										{admin.email}
									</td>
									<td className="w-1/3 mobile:hidden">{admin.role}</td>

									{session?.user.role === "owner" && (
										<>
											{admin.role !== "owner" ? (
												<td>
													<button
														onClick={() => openModalToDelete(admin)}
														className="btn btn--danger !p-2"
													>
														<TrashIcon className="w-6 h-6" />
													</button>
												</td>
											) : (
												<td></td>
											)}
										</>
									)}
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
			)}
		</>
	)
}

export default SettingPage
