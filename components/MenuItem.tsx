import type { NextPage } from 'next'

import { useDrag } from 'react-dnd'

interface Props {
	name: string
	id: number
	isTeacher: boolean
}

const MenuItem: NextPage<Props> = ({ name, id, isTeacher }) => {
	const [collected, drag] = useDrag(() => ({
		type: isTeacher ? 'TeacherMenuItem' : 'SubjectMenuItem',
		item: { id, name },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
			name: name,
		}),
	}))

	return <a ref={drag}>{name}</a>
}

export default MenuItem
