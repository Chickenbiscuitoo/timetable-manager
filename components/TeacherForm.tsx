import { NextPage } from 'next'
import { useState } from 'react'
import useTimetableStore from '../store'

const TeacherForm: NextPage = () => {
	const { addTeacher } = useTimetableStore()

	const [formData, setFormData] = useState({
		name: '',
		shortname: '',
		email: '',
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
			addTeacher(name, shortname, email)
			setFormData({
				name: '',
				shortname: '',
				email: '',
			})
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Name</span>
					<input
						type="text"
						placeholder="John Doe"
						className="input input-bordered"
						name="name"
						value={formData.name}
						onChange={handleChange}
					/>
				</label>
				{errorMessages.nameError && (
					<p className="text-error text-xs">
						{errorMessages.nameError}
					</p>
				)}
			</div>
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Short Name</span>
					<input
						type="text"
						placeholder="JD"
						className="input input-bordered"
						name="shortname"
						value={formData.shortname}
						onChange={handleChange}
					/>
				</label>
				{errorMessages.shortnameError && (
					<p className="text-error text-xs">
						{errorMessages.shortnameError}
					</p>
				)}
			</div>
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Email</span>
					<input
						type="text"
						placeholder="info@site.com"
						className="input input-bordered"
						name="email"
						value={formData.email}
						onChange={handleChange}
					/>
				</label>
				{errorMessages.emailError && (
					<p className="text-error text-xs">
						{errorMessages.emailError}
					</p>
				)}
			</div>
			<button
				className="btn btn-outline btn-success w-full"
				disabled={
					errorMessages.nameError ||
					errorMessages.shortnameError ||
					errorMessages.emailError
						? true
						: false
				}
				onClick={handleSubmit}
			>
				Submit
			</button>
		</div>
	)
}

export default TeacherForm
