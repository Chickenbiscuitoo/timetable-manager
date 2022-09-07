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
		item: { id, name, shortname, commitee_id },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}))

	return (
		<a
			ref={drag}
			className="btn btn-outline btn-nautral btn-md rounded-xl m-1 mr-2 hover:cursor-grab"
		>{`${name} | ${shortname}`}</a>
	)
}

export default MenuItem
