import type { NextPage } from 'next'

import { useDrag } from 'react-dnd'

interface Props {
	name: string
	shortname: string
	commitee_id: number
	id: number
	isTeacher: boolean
}

const MenuItem: NextPage<Props> = ({
	name,
	shortname,
	commitee_id,
	id,
	isTeacher,
}) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: isTeacher ? 'TeacherMenuItem' : 'SubjectMenuItem',
		item: { id },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}))

	return (
		<a
			ref={drag}
			className="gap-3 btn btn-outline btn-neutral btn-md rounded-xl w-full p-0 hover:cursor-grab"
		>
			<h5 className="inline">{name}</h5>
			<h5 className="inline text-primary font-bold">{shortname}</h5>
		</a>
	)
}

export default MenuItem
