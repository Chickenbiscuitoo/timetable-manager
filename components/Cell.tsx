import type { NextPage } from 'next'
import { Subject, Teacher } from '@prisma/client'

import styles from '../styles/Timetable.module.css'

import useTimetableStore from '../store'
import { useDrop } from 'react-dnd'

import SplitCell from './SplitCell'
import { MdDeleteForever } from 'react-icons/md'

interface Props {
	position: number
	subject: Subject[]
	teacher?: Teacher[]
}

const Cell: NextPage<Props> = ({ subject, position, teacher }) => {
	const { addLesson, updateLesson, deleteLesson } = useTimetableStore()

	const handleDrop = () => {
		if (itemType === 'TeacherMenuItem') {
			if (!teacher) {
				updateLesson(9, position, subject, [itemProps])
			} else if (!!teacher) {
				updateLesson(9, position, subject, [...teacher, itemProps])
			}
		} else if (itemType === 'SubjectMenuItem') {
			if (!subject && !teacher) {
				addLesson(9, position, [itemProps])
			} else if (!!subject && !teacher) {
				updateLesson(9, position, [...subject, itemProps])
			} else if (!!subject && !!teacher) {
				updateLesson(9, position, [...subject, itemProps], teacher)
			}
		}
	}

	const handleCanDrop = () => {
		if (itemType === 'SubjectMenuItem') {
			if (!subject) {
				return true
			} else if (subject.length <= 1) {
				return true
			} else {
				return false
			}
		} else if (itemType === 'TeacherMenuItem') {
			if (!!subject) {
				if (!teacher) {
					return true
				} else if (teacher.length <= 1) {
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

	const handleRemove = () => {
		return deleteLesson(9, position)
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

	const renderCell = () => {
		if (
			(subject && subject.length > 1) ||
			(teacher && teacher.length > 1)
		) {
			if (!!teacher) {
				if (subject.length > 1 && teacher.length > 1) {
					return (
						<td
							ref={drop}
							className={`${
								styles.cell_split
							} ${getClassName()}`}
						>
							<SplitCell
								subject={subject[0]}
								teacher={teacher[0]}
								position="cell_up"
							/>
							<SplitCell
								subject={subject[1]}
								teacher={teacher[1]}
								position="cell_down"
							/>
							<span
								onClick={handleRemove}
								className={styles.btn_remove}
							>
								<MdDeleteForever />
							</span>
						</td>
					)
				} else if (subject.length > 1 && teacher.length < 2) {
					return (
						<td
							ref={drop}
							className={`${
								styles.cell_split
							} ${getClassName()}`}
						>
							<SplitCell
								subject={subject[0]}
								teacher={teacher[0]}
								position="cell_up"
							/>
							<SplitCell
								subject={subject[1]}
								teacher={teacher[0]}
								position="cell_down"
							/>
							<span
								onClick={handleRemove}
								className={styles.btn_remove}
							>
								<MdDeleteForever />
							</span>
						</td>
					)
				} else if (subject.length < 2 && teacher.length > 1) {
					return (
						<td
							ref={drop}
							className={`${
								styles.cell_split
							} ${getClassName()}`}
						>
							<SplitCell
								subject={subject[0]}
								teacher={teacher[0]}
								position="cell_up"
							/>
							<SplitCell
								subject={subject[0]}
								teacher={teacher[1]}
								position="cell_down"
							/>
							<span
								onClick={handleRemove}
								className={styles.btn_remove}
							>
								<MdDeleteForever />
							</span>
						</td>
					)
				} else if (subject.length < 2 && teacher.length < 2) {
					return (
						<td ref={drop} className={getClassName()}>
							{`${subject[0].name} | ${teacher[0].name}`}
							<span
								onClick={handleRemove}
								className={styles.btn_remove}
							>
								<MdDeleteForever />
							</span>
						</td>
					)
				}
			} else if (!teacher) {
				if (subject.length > 1) {
					return (
						<>
							<td
								ref={drop}
								className={`${
									styles.cell_split
								} ${getClassName()}`}
							>
								<SplitCell
									subject={subject[0]}
									position="cell_up"
								/>
								<SplitCell
									subject={subject[1]}
									position="cell_down"
								/>
								<span
									onClick={handleRemove}
									className={styles.btn_remove}
								>
									<MdDeleteForever />
								</span>
							</td>
						</>
					)
				} else if (subject.length < 2) {
					return (
						<td ref={drop} className={getClassName()}>
							{subject[0].name}
							<span
								onClick={handleRemove}
								className={styles.btn_remove}
							>
								<MdDeleteForever />
							</span>
						</td>
					)
				}
			}
		} else {
			if (subject && teacher) {
				return (
					<td ref={drop} className={getClassName()}>
						{`${subject[0].name} | ${teacher[0].name}`}
						<span
							onClick={handleRemove}
							className={styles.btn_remove}
						>
							<MdDeleteForever />
						</span>
					</td>
				)
			} else if (subject) {
				return (
					<td ref={drop} className={getClassName()}>
						{subject[0].name}
						<span
							onClick={handleRemove}
							className={styles.btn_remove}
						>
							<MdDeleteForever />
						</span>
					</td>
				)
			} else {
				return <td ref={drop} className={getClassName()}></td>
			}
		}
	}

	return <>{renderCell()}</>
}

export default Cell
