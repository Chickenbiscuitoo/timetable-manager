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
	committee_id: number
}

const SubjectsManagerCell: NextPage<SubjectsProps> = ({
	id,
	name,
	shortname,
	committee_id,
}) => {
	const [clickedUpdate, setClickedUpdate] = useState(false)
	const [formData, setFormData] = useState({
		name,
		shortname,
		committee_id,
	})
	const [errorMessages, setErrorMessages] = useState({
		nameError: '',
		shortnameError: '',
	})

	const validateName = (name: string) => {
		if (name.trim().length < 3) {
			setErrorMessages({
				...errorMessages,
				nameError: 'Name must be at least 3 characters long',
			})
		} else if (name.trim().length > 128) {
			setErrorMessages({
				...errorMessages,
				nameError: 'Name must be less than 128 characters long',
			})
		} else {
			setErrorMessages({
				...errorMessages,
				nameError: '',
			})
		}
	}

	const validateShortname = (shortname: string) => {
		if (shortname.trim().length < 2) {
			setErrorMessages({
				...errorMessages,
				shortnameError:
					'Shortname must be at least 2 characters long',
			})
		} else if (shortname.trim().length > 8) {
			setErrorMessages({
				...errorMessages,
				shortnameError:
					'Shortname must be less than 8 characters long',
			})
		} else {
			setErrorMessages({
				...errorMessages,
				shortnameError: '',
			})
		}
	}

	const { bindings, committees, updateSubject, removeSubject } =
		useTimetableStore()

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

		if (e.target.name === 'name') {
			validateName(e.target.value)
		} else if (e.target.name === 'shortname') {
			validateShortname(e.target.value)
		}
	}

	const handleSubmit = () => {
		const name = formData.name.trim()
		const shortname = formData.shortname.trim().toUpperCase()
		const commitee_id = formData.committee_id

		if (
			name &&
			shortname &&
			commitee_id &&
			!errorMessages.nameError &&
			!errorMessages.shortnameError
		) {
			updateSubject(id, name, shortname, commitee_id)
			setFormData({
				name,
				shortname,
				committee_id,
			})
			setClickedUpdate(false)
		}
	}

	const ogSubjectCommittee = committees.find(
		(committee) => committee.id === committee_id
	)

	const subjectCommittee = committees.find(
		(committee) => committee.id === formData.committee_id
	)

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
				<td>{ogSubjectCommittee?.name || committee_id}</td>
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
								className="block mb-1 input input-bordered max-w-xs focus:input-primary"
							/>
							{errorMessages.nameError && (
								<p className="text-xs text-error mb-2">
									{errorMessages.nameError}
								</p>
							)}
							<input
								type="text"
								placeholder={shortname}
								value={formData.shortname}
								name="shortname"
								onChange={handleChange}
								className="mb-1 block input input-bordered max-w-xs focus:input-primary"
							/>
							{errorMessages.shortnameError && (
								<p className="text-xs text-error">
									{errorMessages.shortnameError}
								</p>
							)}
						</div>
					</td>
					<td>
						<div className="dropdown">
							<label
								tabIndex={0}
								className="btn btn-outline btn-md text-xs w-full"
							>
								{subjectCommittee?.name ||
									formData.committee_id}
							</label>
							<ul
								tabIndex={0}
								className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
							>
								{committees.map((committee) => (
									<li key={committee.id}>
										<a
											onClick={() =>
												setFormData(
													(prevFormData) => ({
														...prevFormData,
														committee_id:
															committee.id,
													})
												)
											}
										>
											{committee.name}
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
							disabled={
								errorMessages.nameError ||
								errorMessages.shortnameError
									? true
									: false
							}
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
