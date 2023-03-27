import { NextPage } from 'next'
import { useState, useRef } from 'react'
import useTimetableStore from '../store'

import useKeyPress from '../hooks/useKeyPress'

const CommitteesForm: NextPage = () => {
	const { addCommittee } = useTimetableStore()

	const committeesForm = useRef<HTMLDivElement>(null)
	useKeyPress(
		'Enter',
		false,
		() => {
			handleSubmit()
		},
		committeesForm.current
	)

	const [formData, setFormData] = useState({
		name: '',
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
			addCommittee(name)
			setFormData({
				name: '',
			})
		}
	}

	return (
		<div className="flex flex-col gap-2" ref={committeesForm}>
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Name</span>
					<input
						type="text"
						placeholder="Committee 1"
						className="input input-bordered"
						name="name"
						value={formData.name}
						onChange={handleChange}
					/>
				</label>
				{errorMessages.nameError && (
					<p className="text-error text-sm">
						{errorMessages.nameError}
					</p>
				)}
			</div>
			<button
				className="btn btn-outline btn-success w-full"
				disabled={errorMessages.nameError ? true : false}
				onClick={handleSubmit}
			>
				Submit
			</button>
		</div>
	)
}

export default CommitteesForm
