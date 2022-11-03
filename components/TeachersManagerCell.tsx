import { NextPage } from 'next'
import useTimetableStore from '../store'

import { flatten } from '../utils/arraysFuncs'

import { BsFillPenFill } from 'react-icons/bs'
import { FaTrash } from 'react-icons/fa'

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
	const { bindings } = useTimetableStore()

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

	return (
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
				<button className="btn btn-ghost btn-xs hover:text-blue-400">
					<BsFillPenFill />
				</button>
				<button className="btn btn-ghost btn-xs hover:text-red-400">
					<FaTrash />
				</button>
			</th>
		</tr>
	)
}

export default TeachersManagerCell
