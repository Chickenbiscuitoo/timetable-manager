import { NextPage } from 'next'

import useTimetableStore from '../store'

interface BindingCardProps {
	teacherId: number
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
			teacher: bind.teachers.find((tch) => tch.id === teacherId),
		}))

	return <div className="absolute">BindingCardos</div>
}

export default BindingCard
