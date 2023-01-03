import { NextPage } from 'next'
import useTimetableStore from '../store'

import { flatten } from '../utils/arraysFuncs'

import { BsFillPenFill } from 'react-icons/bs'
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react'

interface TeacherProps {
	id: number
	name: string
	teacher: {
		id: number
		name: string
		shortname: string
		email: string
	}
	grade: number
}

const ClassesManagerCell: NextPage<TeacherProps> = ({
	id,
	name,
	teacher,
	grade,
}) => {
	const [clickedUpdate, setClickedUpdate] = useState(false)
	const [formData, setFormData] = useState({
		name,
		teacherId: teacher.id,
	})
	const [errrorMessage, setErrorMessage] = useState('')

	const validateName = (name: string) => {
		if (name.trim().length < 3) {
			setErrorMessage('Name must be at least 3 characters long')
		} else if (name.trim().length > 64) {
			setErrorMessage('Name must be less than 64 characters long')
		} else {
			setErrorMessage('')
		}
	}

	const { bindings, teachers, updateClass, removeClass } =
		useTimetableStore()

	const selectedClassTeacher = teachers.find(
		(tch) => tch.id === formData.teacherId
	)

	const classesTotalLessons = () => {
		const classesLessons = bindings
			.filter((b) => b.cl.id === id)
			.map((binding) =>
				binding.teachers.map((teacher) => teacher.lessons)
			)

		const lessons = flatten(classesLessons).reduce(
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

		if (e.target.name === 'name') {
			validateName(e.target.value)
		}
	}

	const handleSubmit = () => {
		const name = formData.name.trim().toUpperCase()
		const teacherId = formData.teacherId

		if (name && teacherId && !errrorMessage) {
			updateClass(id, name, grade, teacherId)
			setFormData({
				name,
				teacherId,
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
						<div>
							<div className="font-bold text-primary text-xl">
								{name}
							</div>
						</div>
					</div>
				</td>
				<td>
					<div className="font-bold">{teacher.name}</div>
					<div className="text-sm opacity-50">
						{teacher.shortname}
					</div>
				</td>
				<td>{classesTotalLessons()}</td>
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
						onClick={() => removeClass(id)}
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
						<input
							type="text"
							placeholder={name}
							value={formData.name}
							name="name"
							onChange={handleChange}
							className="input input-bordered max-w-xs focus:input-primary w-full"
						/>
						{errrorMessage && (
							<p className="text-sm text-error">
								{errrorMessage}
							</p>
						)}
					</td>
					<td>
						<div className="dropdown">
							<label
								tabIndex={0}
								className="btn btn-outline btn-md text-xs w-full"
							>
								{selectedClassTeacher
									? selectedClassTeacher.name
									: 'Select'}
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
					</td>
					<td></td>
					<td>
						<button
							onClick={handleSubmit}
							disabled={errrorMessage ? true : false}
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

export default ClassesManagerCell
