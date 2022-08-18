import type { NextPage } from 'next'
import styles from '../styles/Timetable.module.css'

import useTimetableStore from '../store'
import { useDrop } from 'react-dnd'

interface Props {
	lesson_id: number
	subject: string
	teacher?: string
	position: string
}

const SplitCell: NextPage<Props> = ({
	lesson_id,
	subject,
	teacher,
	position,
}) => {
	const { addLesson } = useTimetableStore()

	// const [{ isOver, canDrop, itemProps }, drop]: any = useDrop({
	// 	accept: 'MenuItem',
	// 	// canDrop: () => !lesson_id,
	// 	// drop: () => addLesson(lesson_id, itemProps.name),
	// 	collect: (monitor) => ({
	// 		canDrop: !!monitor.canDrop(),
	// 		isOver: !!monitor.isOver(),
	// 		itemProps: monitor.getItem(),
	// 	}),
	// })

	// ////// TODO //////
	// const getClassName = () => {
	// 	if (isOver && canDrop) {
	// 		return styles.hovered_success
	// 	} else if (isOver && !canDrop) {
	// 		return styles.hovered_fail
	// 	}
	// }

	return (
		<span className={styles[position]}>
			{teacher} {subject}
		</span>
	)
}

export default SplitCell
