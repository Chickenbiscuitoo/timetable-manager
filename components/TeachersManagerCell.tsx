import { NextPage } from 'next'
import useTimetableStore from '../store'

import { flatten } from '../utils/arraysFuncs'

import { BsFillPenFill } from 'react-icons/bs'
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react'

interface TeacherProps {
	id: number
	name: string
	shortname: string
	email: string
}

const TeachersManagerCell: NextPage<TeacherProps> = ({
	id,
	name,
	shortname,
	email,
}) => {
	const [clickedUpdate, setClickedUpdate] = useState(false)
	const [formData, setFormData] = useState({
		name,
		shortname,
		email,
	})

	const { bindings, updateTeacher, removeTeacher } = useTimetableStore()

	const teachersTotalLessons = () => {
		const teachersLessons = bindings.map((binding) =>
			binding.teachers
				.filter((tch) => id === tch.id)
				.map((tch) => tch.lessons)
		)

		const lessons = flatten(teachersLessons).reduce(
			(acc: number, curr: number) => acc + curr,
			0
		)

		return lessons
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = () => {
		const name = formData.name.trim()
		const shortname = formData.shortname.trim()
		const email = formData.email.trim()

		if (name && shortname && email) {
			updateTeacher(id, name, shortname, email)
			setFormData({
				name,
				shortname,
				email,
			})
			setClickedUpdate(false)
		}
	}

	return (
		<>
			<tr>
				<th>
					<label>
						<input type="checkbox" className="checkbox" />
					</label>
				</th>
				<td>
					<div className="flex items-center space-x-3">
						<div className="avatar">
							<div className="mask mask-squircle w-12 h-12">
								<img
									src="https://upload.wikimedia.org/wikipedia/commons/2/21/Danny_DeVito_by_Gage_Skidmore.jpg"
									alt="Avatar Tailwind CSS Component"
								/>
							</div>
						</div>
						<div>
							<div className="font-bold">{name}</div>
							<div className="text-sm opacity-50">
								{shortname}
							</div>
						</div>
					</div>
				</td>
				<td>
					<div className="text-md">{email}</div>
				</td>
				<td>{teachersTotalLessons()}</td>
				<th>
					<button
						onClick={() =>
							setClickedUpdate((prevState) => !prevState)
						}
						className="btn btn-ghost btn-xs hover:text-blue-400"
					>
						<BsFillPenFill />
					</button>
					<button
						onClick={() => removeTeacher(id)}
						className="btn btn-ghost btn-xs hover:text-red-400"
					>
						<FaTrash />
					</button>
				</th>
			</tr>
			{clickedUpdate && (
				<tr>
					<td></td>
					<td>
						<div>
							<input
								type="text"
								placeholder={name}
								value={formData.name}
								name="name"
								onChange={handleChange}
								className="input input-bordered max-w-xs focus:input-primary w-8/12"
							/>
							<input
								type="text"
								placeholder={shortname}
								value={formData.shortname}
								name="shortname"
								onChange={handleChange}
								className="input input-bordered max-w-xs focus:input-primary w-4/12"
							/>
						</div>
					</td>
					<td>
						<input
							type="text"
							placeholder={email}
							value={formData.email}
							name="email"
							onChange={handleChange}
							className="input input-bordered w-full max-w-xs focus:input-primary"
						/>
					</td>
					<td></td>
					<td>
						<button
							onClick={handleSubmit}
							className="btn btn-xs btn-success w-full"
						>
							Submit
						</button>
					</td>
				</tr>
			)}
		</>
	)
}

export default TeachersManagerCell
