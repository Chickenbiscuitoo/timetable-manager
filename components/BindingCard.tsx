import { NextPage } from 'next'

import useTimetableStore from '../store'

interface BindingCardProps {
	teacherId: number
}

interface BindingTeacher {
	id: number
	name: string
	shortname: string
	email: string
	lessons: number
}

const BindingCard: NextPage<BindingCardProps> = ({ teacherId }) => {
	const { teachers, bindings } = useTimetableStore()

	const teacher = teachers.find((teacher) => teacher.id === teacherId)

	const teacherBindings = bindings
		.filter((binding) =>
			binding.teachers.some((tch) => tch.id === teacherId)
		)
		.map((bind) => ({
			...bind,
			teacher: bind.teachers.find(
				(tch) => tch.id === teacherId
			) as BindingTeacher,
		}))

	const teacherTotalLessons = teacherBindings.reduce((acc, binding) => {
		return acc + binding.teacher.lessons
	}, 0)

	return (
		<div
			tabIndex={0}
			className="fixed right-56 z-50 card compact dropdown-content shadow bg-base-100 rounded-box w-fit-content h-fit-content"
		>
			<div className="card-compact bg-base-300 border border-transparent rounded-xl shadow-lg">
				<table className="card-body ">
					<tbody>
						<tr>
							<td className="border border-white text-white text-lg p-3 font-bold">
								{teacher?.shortname}
							</td>
							<td className="border border-white text-white text-lg p-3 font-bold">
								{teacherTotalLessons}h
							</td>
							{teacherBindings.map((binding) => (
								<td
									key={binding.id}
									className="border border-white text-white p-3 text-center"
								>
									<h3 className="text-md font-semibold">
										{binding.cl.name}
									</h3>
									<h3 className="text-md font-bold">
										{binding.subject.shortname}
									</h3>
									<h3 className="text-sm">
										{binding.teacher.lessons}h
									</h3>
								</td>
							))}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default BindingCard
