import { NextPage } from 'next'
import useTimetableStore from '../store'

import { flatten } from '../utils/arraysFuncs'

import { BsFillPenFill } from 'react-icons/bs'
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react'

interface TeacherProps {
	id: number
	name: string
	teacherId: number
	grade: number
}

const ClassesManagerCell: NextPage<TeacherProps> = ({
	id,
	name,
	teacherId,
	grade,
}) => {
	const [clickedUpdate, setClickedUpdate] = useState(false)
	const [formData, setFormData] = useState({
		name,
		teacherId,
		grade,
	})

	const { bindings, teachers, updateClass, removeClass } =
		useTimetableStore()

	const classTeacher = teachers.find((tch) => tch.id === teacherId)

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
	}

	const handleSubmit = () => {
		const name = formData.name.trim().toUpperCase()
		const teacherId = formData.teacherId
		const grade = formData.grade

		if (name && teacherId && grade) {
			updateClass(id, name, teacherId, grade)
			setFormData({
				name,
				teacherId,
				grade,
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
					<div className="font-bold">{classTeacher?.name}</div>
					<div className="text-sm opacity-50">
						{classTeacher?.shortname}
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
								value={formData.teacherId}
								name="teacherId"
								onChange={handleChange}
								className="input input-bordered max-w-xs focus:input-primary w-4/12"
							/>
						</div>
					</td>
					<td>
						<input
							type="text"
							pattern="[0-9]"
							placeholder={grade.toString()}
							value={formData.grade}
							name="grade"
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

export default ClassesManagerCell
