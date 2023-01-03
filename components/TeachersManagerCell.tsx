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
	const [errorMessages, setErrorMessages] = useState({
		nameError: '',
		shortnameError: '',
		emailError: '',
	})

	const validateName = (name: string) => {
		if (name.trim().length < 3) {
			setErrorMessages({
				...errorMessages,
				nameError: 'Name must be at least 3 characters long',
			})
		} else if (name.trim().length > 64) {
			setErrorMessages({
				...errorMessages,
				nameError: 'Name must be less than 64 characters long',
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

	const validateEmail = (email: string) => {
		const emailRegex = new RegExp(
			'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
		)

		if (!emailRegex.test(email.trim()) || email.trim().length < 3) {
			setErrorMessages({
				...errorMessages,
				emailError: 'Please enter a valid email address',
			})
		} else {
			setErrorMessages({
				...errorMessages,
				emailError: '',
			})
		}
	}

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

		if (e.target.name === 'name') {
			validateName(e.target.value)
		} else if (e.target.name === 'shortname') {
			validateShortname(e.target.value)
		} else if (e.target.name === 'email') {
			validateEmail(e.target.value)
		}
	}

	const handleSubmit = () => {
		const name = formData.name.trim()
		const shortname = formData.shortname.trim()
		const email = formData.email.trim()

		if (
			name &&
			shortname &&
			email &&
			!errorMessages.nameError &&
			!errorMessages.shortnameError &&
			!errorMessages.emailError
		) {
			updateTeacher(id, name, shortname, email)
			setFormData({
				name,
				shortname,
				email,
			})
			setClickedUpdate(false)
			setErrorMessages({
				nameError: '',
				shortnameError: '',
				emailError: '',
			})
			setFormData({
				name,
				shortname,
				email,
			})
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
							disabled={
								errorMessages.emailError ||
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
			{clickedUpdate &&
				(errorMessages.emailError ||
					errorMessages.nameError ||
					errorMessages.shortnameError) && (
					<tr>
						<td></td>
						<td>
							{errorMessages.nameError && (
								<p className="text-error">
									{errorMessages.nameError}
								</p>
							)}
							{errorMessages.shortnameError && (
								<p className="text-error">
									{errorMessages.shortnameError}
								</p>
							)}
						</td>
						<td>
							{errorMessages.emailError && (
								<p className="text-error">
									{errorMessages.emailError}
								</p>
							)}
						</td>
						<td></td>
						<td></td>
					</tr>
				)}
		</>
	)
}

export default TeachersManagerCell
