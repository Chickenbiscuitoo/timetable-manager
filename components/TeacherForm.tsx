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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = () => {
		const name = formData.name.trim()
		const shortname = formData.shortname.trim()
		const email = formData.email.trim()

		if (name && shortname && email) {
			addTeacher(name, shortname, email)
			setFormData({
				name: '',
				shortname: '',
				email: '',
			})
		}
	}

	return (
		<div className="">
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
			</div>
			<button
				className="btn btn-outline btn-success btn-wide"
				onClick={handleSubmit}
			>
				Submit
			</button>
		</div>
	)
}

// {
//     id: 1,
//     name: 'John Doe',
//     shortname: 'JD',
//     email: 'john.doe@gmail.com',
// },

export default TeacherForm
