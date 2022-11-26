import { NextPage } from 'next'
import useTimetableStore from '../store'

import { flatten } from '../utils/arraysFuncs'

import { BsFillPenFill } from 'react-icons/bs'
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react'

interface SubjectsProps {
	id: number
	name: string
	shortname: string
	commitee_id: number
}

const SubjectsManagerCell: NextPage<SubjectsProps> = ({
	id,
	name,
	shortname,
	commitee_id,
}) => {
	const [clickedUpdate, setClickedUpdate] = useState(false)
	const [formData, setFormData] = useState({
		name,
		shortname,
		commitee_id,
	})

	const { bindings, updateSubject, removeSubject } = useTimetableStore()

	const subjectTotalLessons = () => {
		const subjectLessons = bindings
			.filter((b) => b.subject.id === id)
			.map((binding) =>
				binding.teachers.map((teacher) => teacher.lessons)
			)

		const lessons = flatten(subjectLessons).reduce(
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
		const shortname = formData.shortname.trim().toUpperCase()
		const commitee_id = formData.commitee_id

		if (name && shortname && commitee_id) {
			updateSubject(id, name, shortname, commitee_id)
			setFormData({
				name,
				shortname,
				commitee_id,
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
							<>
								<div className="font-bold text-primary">
									{name}
								</div>
								<div className="text-sm opacity-50">
									{shortname}
								</div>
							</>
						</div>
					</div>
				</td>
				<td>{commitee_id}</td>
				<td>{subjectTotalLessons()}</td>
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
						onClick={() => removeSubject(id)}
						className="btn btn-ghost btn-xs hover:text-red-400"
					>
						<FaTrash />
					</button>
				</th>
			</tr>
			{clickedUpdate && (
				<tr>
					<td colSpan={2}>
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
						<div className="dropdown">
							<label
								tabIndex={0}
								className="btn btn-outline btn-md text-xs w-full"
							>
								{formData.commitee_id}
							</label>
							<ul
								tabIndex={0}
								className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
							>
								<li>
									<a
										onClick={() =>
											setFormData(
												(prevFormData) => ({
													...prevFormData,
													commitee_id: 1,
												})
											)
										}
									>
										1
									</a>
								</li>
								<li>
									<a
										onClick={() =>
											setFormData(
												(prevFormData) => ({
													...prevFormData,
													commitee_id: 2,
												})
											)
										}
									>
										2
									</a>
								</li>
							</ul>
						</div>
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

export default SubjectsManagerCell