import { NextPage } from 'next'
import { useState } from 'react'
import useTimetableStore from '../store'

const SubjectsForm: NextPage = () => {
	const { teachers, addClass } = useTimetableStore()

	const [formData, setFormData] = useState({
		name: '',
		teacherId: -1,
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = () => {
		const name = formData.name.trim().toUpperCase()
		const teacherId = formData.teacherId

		if (name && teacherId) {
			addClass(name, teacherId)
			setFormData({
				name: '',
				teacherId: -1,
			})
		}
	}

	const selectedClassTeacher = teachers.find(
		(tch) => tch.id == formData.teacherId
	)

	return (
		<div className="flex flex-col gap-2">
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Name</span>
					<input
						type="text"
						placeholder="1.A"
						className="input input-bordered"
						name="name"
						value={formData.name}
						onChange={handleChange}
					/>
				</label>
			</div>
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Class Teacher</span>
					<div className="dropdown">
						<label
							tabIndex={0}
							className="btn btn-ghost bg-base-100 border-gray-200 border-opacity-20 dropdown-toggle w-full font-normal text-md text-left justify-start normal-case"
						>
							{selectedClassTeacher
								? selectedClassTeacher.name
								: 'Select Class Teacher'}
						</label>
						<ul
							tabIndex={0}
							className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
						>
							{teachers.map((tch) => (
								<li key={tch.id}>
									<a
										onClick={() =>
											setFormData(
												(prevFormData) => ({
													...prevFormData,
													teacherId: tch.id,
												})
											)
										}
									>
										{tch.name}
									</a>
								</li>
							))}
						</ul>
					</div>
				</label>
			</div>
			<button
				className="btn btn-outline btn-success w-full"
				onClick={handleSubmit}
			>
				Submit
			</button>
		</div>
	)
}

export default SubjectsForm
