import type { NextPage } from 'next'
import useTimetableStore from '../store'
import { useDrop } from 'react-dnd'

interface Props {
	subject: string
	lesson_id: number
	position: number
}

const Cell: NextPage<Props> = ({ subject, lesson_id, position }) => {
	const { addLesson } = useTimetableStore()
	console.log()

	const [{ isOver, itemProps }, drop]: any = useDrop({
		accept: 'MenuItem',
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			itemProps: monitor.getItem(),
		}),
		drop: () => {
			if (!lesson_id) {
				addLesson(position, itemProps.name)
			}
		},
	})

	return <td ref={drop}>{subject}</td>
}

export default Cell
