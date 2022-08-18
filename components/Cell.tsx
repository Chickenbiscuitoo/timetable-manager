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
	const { addLesson, updateLesson } = useTimetableStore()

	const handleDrop = () => {
		if (itemType === 'TeacherMenuItem' && !teacher) {
			updateLesson(lesson_id, subject, itemProps.name)
		} else if (itemType === 'TeacherMenuItem' && !!teacher) {
			updateLesson(lesson_id, subject, [teacher, itemProps.name])
		} else if (itemType === 'SubjectMenuItem' && !lesson_id) {
			addLesson(position, itemProps.name)
		} else if (
			itemType === 'SubjectMenuItem' &&
			!!lesson_id &&
			!teacher
		) {
			updateLesson(lesson_id, [subject, itemProps.name])
		} else if (
			itemType === 'SubjectMenuItem' &&
			!!lesson_id &&
			!!teacher
		) {
			updateLesson(lesson_id, [subject, itemProps.name], teacher)
		}
	}

	const handleCanDrop = () => {
		if (itemType === 'SubjectMenuItem') {
			if (!Array.isArray(subject)) {
				return true
			} else {
				return false
			}
		} else if (itemType === 'TeacherMenuItem') {
			if (!!subject) {
				if (!Array.isArray(teacher)) {
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		} else {
			return false
		}
	}

	const [{ isOver, canDrop, itemType, itemProps }, drop]: any = useDrop({
		accept: ['TeacherMenuItem', 'SubjectMenuItem'],
		canDrop: handleCanDrop,
		drop: handleDrop,
		collect: (monitor) => ({
			canDrop: !!monitor.canDrop(),
			isOver: !!monitor.isOver(),
			itemType: monitor.getItemType(),
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
			{Array.isArray(subject) || Array.isArray(teacher) ? (
				<td
					ref={drop}
					className={`${styles.cell_split} ${getClassName()}`}
				>
					{Array.isArray(teacher) && Array.isArray(subject) ? (
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
					) : Array.isArray(subject) &&
					  !Array.isArray(teacher) ? (
						<>
							<SplitCell
								lesson_id={lesson_id}
								subject={subject[0]}
								teacher={teacher}
								position="cell_up"
							/>
							<SplitCell
								lesson_id={lesson_id}
								subject={subject[1]}
								teacher={teacher}
								position="cell_down"
							/>
						</>
					) : !Array.isArray(subject) &&
					  Array.isArray(teacher) ? (
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
					) : (
						<td ref={drop} className={getClassName()}>
							{subject}
							{teacher && ` | ${teacher}`}
						</td>
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
