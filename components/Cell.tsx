import type { NextPage } from 'next'
import styles from '../styles/Timetable.module.css'

import useTimetableStore from '../store'
import { useDrop } from 'react-dnd'

import SplitCell from './SplitCell'

interface Props {
	subject: string | string[]
	lesson_id: number
	position: number
	teacher?: string | string[] | undefined
}

const Cell: NextPage<Props> = ({
	subject,
	lesson_id,
	position,
	teacher,
}) => {
	const { addLesson } = useTimetableStore()

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
		<>
			{Array.isArray(teacher) ? (
				<td className={styles.cell_split}>
					{Array.isArray(subject) ? (
						<>
							<SplitCell
								lesson_id={lesson_id}
								subject={subject[0]}
								teacher={teacher[0]}
								position="cell_up"
							/>
							<SplitCell
								lesson_id={lesson_id}
								subject={subject[1]}
								teacher={teacher[1]}
								position="cell_down"
							/>
						</>
					) : (
						<>
							<SplitCell
								lesson_id={lesson_id}
								subject={subject}
								teacher={teacher[0]}
								position="cell_up"
							/>
							<SplitCell
								lesson_id={lesson_id}
								subject={subject}
								teacher={teacher[1]}
								position="cell_down"
							/>
						</>
					)}
				</td>
			) : (
				<td ref={drop} className={getClassName()}>
					{subject}
					{teacher && ` | ${teacher}`}
				</td>
			)}
		</>
	)
}

// ref={drop} className={getClassName()

export default Cell
