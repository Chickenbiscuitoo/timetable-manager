import { NextPage } from 'next'
import useTimetableStore from '../store'

import { flatten } from '../utils/arraysFuncs'

import { BsFillPenFill } from 'react-icons/bs'
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react'

interface SubjectsProps {
	id: number
	name: string
}

const CommitteesManagerCell: NextPage<SubjectsProps> = ({ id, name }) => {
	const [clickedUpdate, setClickedUpdate] = useState(false)
	const [formData, setFormData] = useState({
		name,
	})
	const [errorMessages, setErrorMessages] = useState({
		nameError: '',
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

	const { subjects, updateCommittee, deleteCommittee } =
		useTimetableStore()

	const subjectsNum = () => {
		let subNum = 0

		subjects.forEach((subject) => {
			if (subject.committeeId === id) {
				subNum++
			}
		})

		return subNum
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
		const name = formData.name.trim()

		if (name && !errorMessages.nameError) {
			updateCommittee(id, name)
			setFormData({
				name,
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
							</>
						</div>
					</div>
				</td>
				<td>{subjectsNum()}</td>
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
						onClick={() => deleteCommittee(id)}
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
								className="mb-1 input input-bordered max-w-xs focus:input-primary"
							/>
							{errorMessages.nameError && (
								<p className="text-xs text-error mb-2">
									{errorMessages.nameError}
								</p>
							)}
						</div>
					</td>
					<td></td>
					<td>
						<button
							onClick={handleSubmit}
							disabled={
								errorMessages.nameError ? true : false
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

export default CommitteesManagerCell
