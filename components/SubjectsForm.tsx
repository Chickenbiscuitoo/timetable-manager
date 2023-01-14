import { NextPage } from 'next'
import { useState } from 'react'
import useTimetableStore from '../store'

const SubjectsForm: NextPage = () => {
	const { addSubject, committees } = useTimetableStore()

	const [formData, setFormData] = useState({
		name: '',
		shortname: '',
		committeeId: -1,
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
		const committeeId = formData.committeeId

		if (
			name &&
			committeeId !== -1 &&
			!errorMessages.nameError &&
			!errorMessages.shortnameError
		) {
			addSubject(name, shortname, committeeId)
			setFormData({
				name: '',
				shortname: '',
				committeeId: -1,
			})
		}
	}

	const selectedCommittee = committees.find(
		(comm) => comm.id === formData.committeeId
	)

	return (
		<div className="flex flex-col gap-2">
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Name</span>
					<input
						type="text"
						placeholder="Biology"
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
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Shortname</span>
					<input
						type="text"
						placeholder="BIO"
						className="input input-bordered"
						name="shortname"
						value={formData.shortname}
						onChange={handleChange}
					/>
				</label>
				{errorMessages.shortnameError && (
					<p className="text-error text-sm">
						{errorMessages.shortnameError}
					</p>
				)}
			</div>
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Class Teacher</span>
					<div className="dropdown">
						<label
							tabIndex={0}
							className="btn btn-ghost bg-base-100 border-gray-200 border-opacity-20 dropdown-toggle w-full font-normal text-md text-left justify-start normal-case"
						>
							{formData.committeeId !== -1
								? selectedCommittee?.name
								: 'Select Committee'}
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
													committeeId:
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
				</label>
			</div>
			<button
				className="btn btn-outline btn-success w-full"
				disabled={
					errorMessages.nameError ||
					errorMessages.shortnameError ||
					formData.committeeId === -1
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

export default SubjectsForm
