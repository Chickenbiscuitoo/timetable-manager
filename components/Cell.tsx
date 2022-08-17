import type { NextPage } from 'next'
import styles from '../styles/Timetable.module.css'

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

	const [{ isOver, canDrop, itemProps }, drop]: any = useDrop({
		accept: 'MenuItem',
		canDrop: () => !lesson_id,
		drop: () => addLesson(position, itemProps.name),
		collect: (monitor) => ({
			canDrop: !!monitor.canDrop(),
			isOver: !!monitor.isOver(),
			itemProps: monitor.getItem(),
		}),
	})

	const getClassName = () => {
		if (isOver && canDrop) {
			return styles.hovered_success
		} else if (isOver && !canDrop) {
			return styles.hovered_fail
		}
	}

	return (
		<td ref={drop} className={getClassName()}>
			{subject}
		</td>
	)
}

export default Cell
