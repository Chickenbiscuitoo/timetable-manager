import { NextPage } from 'next'
import { useState } from 'react'
import useTimetableStore from '../store'

const ClassesForm: NextPage = () => {
	const { classes, teachers, addClass } = useTimetableStore()

	const [formData, setFormData] = useState({
		name: '',
		grade: 0,
		teacherId: -1,
	})
	const [errrorMessages, setErrorMessages] = useState({
		nameError: '',
		gradeError: '',
		teacherError: '',
	})

	const validateName = (name: string) => {
		if (name.trim().length < 3) {
			setErrorMessages({
				...errrorMessages,
				nameError: 'Name must be at least 3 characters long',
			})
		} else if (name.trim().length > 64) {
			setErrorMessages({
				...errrorMessages,
				nameError: 'Name must be less than 64 characters long',
			})
		} else {
			setErrorMessages({
				...errrorMessages,
				nameError: '',
			})
		}
	}

	const validateGrade = (grade: number) => {
		if (grade <= 0) {
			setErrorMessages({
				...errrorMessages,
				gradeError: 'Grade must be greater than 0',
			})
		} else {
			setErrorMessages({
				...errrorMessages,
				gradeError: '',
			})
		}
	}

	const validateTeacher = (teacherId: number) => {
		if (teacherId <= 0) {
			setErrorMessages({
				...errrorMessages,
				teacherError: 'Teacher must be selected',
			})
		} else {
			setErrorMessages({
				...errrorMessages,
				teacherError: '',
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
		} else if (e.target.name === 'grade') {
			validateGrade(Math.floor(Number(e.target.value)))
		} else if (e.target.name === 'teacherId') {
			validateTeacher(Number(e.target.value))
		}
	}

	const handleSubmit = () => {
		const name = formData.name.trim().toUpperCase()
		const grade = Math.floor(formData.grade)
		const teacherId = formData.teacherId

		if (
			name &&
			grade > 0 &&
			teacherId > 0 &&
			!errrorMessages.nameError
		) {
			addClass(name, grade, teacherId)
			setFormData({
				name: '',
				grade: 0,
				teacherId: -1,
			})
		}
	}

	const selectedClassTeacher = teachers.find(
		(tch) => tch.id == formData.teacherId
	)

	const isTeacherAssigned = (teacherId: number): boolean => {
		if (classes.find((cls) => cls.teacher.id == teacherId)) {
			return true
		} else {
			return false
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Name</span>
					<input
						type="text"
						placeholder="1.A"
						className="input input-bordered"
						name="name"
						value={formData.name}
						onChange={handleChange}
					/>
				</label>
				{errrorMessages.nameError && (
					<p className="text-sm text-error">
						{errrorMessages.nameError}
					</p>
				)}
			</div>
			<div className="form-control">
				<label className="input-group input-group-vertical">
					<span>Grade</span>
					<input
						type="number"
						placeholder="1"
						className="input input-bordered"
						name="grade"
						value={formData.grade === 0 ? '' : formData.grade}
						onChange={handleChange}
					/>
				</label>
				{errrorMessages.gradeError && (
					<p className="text-sm text-error">
						{errrorMessages.gradeError}
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
							{selectedClassTeacher
								? selectedClassTeacher.name
								: 'Select Class Teacher'}
						</label>
						<ul
							tabIndex={0}
							className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
						>
							{teachers.find(
								(tch) => !isTeacherAssigned(tch.id)
							) ? (
								teachers.map(
									(tch) =>
										!isTeacherAssigned(tch.id) && (
											<li key={tch.id}>
												<a
													onClick={() =>
														setFormData(
															(
																prevFormData
															) => ({
																...prevFormData,
																teacherId:
																	tch.id,
															})
														)
													}
												>
													{tch.name}
												</a>
											</li>
										)
								)
							) : (
								<li>
									<a>No Teacher Available</a>
								</li>
							)}
						</ul>
					</div>
				</label>
				{errrorMessages.teacherError && (
					<p className="text-sm text-error">
						{errrorMessages.teacherError}
					</p>
				)}
			</div>
			<button
				className="btn btn-outline btn-success w-full"
				disabled={
					!formData.name ||
					!formData.grade ||
					!formData.teacherId ||
					errrorMessages.nameError ||
					errrorMessages.gradeError ||
					errrorMessages.teacherError
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

export default ClassesForm
