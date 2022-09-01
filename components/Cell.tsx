import type { NextPage } from 'next'
import { Subject, Teacher } from '@prisma/client'

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
	const { addLesson, updateLesson, deleteLesson, selectedClass } =
		useTimetableStore()

	const handleDrop = () => {
		if (itemType === 'TeacherMenuItem') {
			if (!teacher) {
				updateLesson(selectedClass, position, subject, [itemProps])
			} else if (!!teacher) {
				updateLesson(selectedClass, position, subject, [
					...teacher,
					itemProps,
				])
			}
		} else if (itemType === 'SubjectMenuItem') {
			if (!subject && !teacher) {
				addLesson(selectedClass, position, [itemProps])
			} else if (!!subject && !teacher) {
				updateLesson(selectedClass, position, [
					...subject,
					itemProps,
				])
			} else if (!!subject && !!teacher) {
				updateLesson(
					selectedClass,
					position,
					[...subject, itemProps],
					teacher
				)
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
		return deleteLesson(selectedClass, position)
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

	// const getClassName = () => {
	// 	if (isOver && canDrop) {
	// 		return styles.hovered_success
	// 	} else if (isOver && !canDrop) {
	// 		return styles.hovered_fail
	// 	}
	// }

	const renderCell = () => {
		if (
			(subject && subject.length > 1) ||
			(teacher && teacher.length > 1)
		) {
			if (!!teacher) {
				if (subject.length > 1 && teacher.length > 1) {
					return (
						<td
							className="border border-slate-700 relative h-full w-full"
							ref={drop}
						>
							<SplitCell
								subject={subject[0]}
								teacher={teacher[0]}
								position="left"
							/>
							<SplitCell
								subject={subject[1]}
								teacher={teacher[1]}
								position="right"
							/>
							<span
								onClick={handleRemove}
								className="absolute top-1 right-1 cursor-pointer"
							>
								<MdDeleteForever />
							</span>
						</td>
					)
				} else if (subject.length > 1 && teacher.length < 2) {
					return (
						<td
							className="border border-slate-700 relative h-full w-full"
							ref={drop}
						>
							<SplitCell
								subject={subject[0]}
								teacher={teacher[0]}
								position="left"
							/>
							<SplitCell
								subject={subject[1]}
								teacher={teacher[0]}
								position="right"
							/>
							<span
								onClick={handleRemove}
								className="absolute top-1 right-1 cursor-pointer"
							>
								<MdDeleteForever />
							</span>
						</td>
					)
				} else if (subject.length < 2 && teacher.length > 1) {
					return (
						<td
							className="border border-slate-700 relative h-full w-full"
							ref={drop}
						>
							<SplitCell
								subject={subject[0]}
								teacher={teacher[0]}
								position="left"
							/>
							<SplitCell
								subject={subject[0]}
								teacher={teacher[1]}
								position="right"
							/>
							<span
								onClick={handleRemove}
								className="absolute top-1 right-1 cursor-pointer"
							>
								<MdDeleteForever />
							</span>
						</td>
					)
				} else if (subject.length < 2 && teacher.length < 2) {
					return (
						<td
							className="border border-slate-700 relative h-full w-full"
							ref={drop}
						>
							{`${subject[0].name} | ${teacher[0].name}`}
							<span
								onClick={handleRemove}
								className="absolute top-1 right-1 cursor-pointer"
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
								className="border border-slate-700 relative h-full w-full"
								ref={drop}
							>
								<SplitCell
									subject={subject[0]}
									position="left"
								/>
								<SplitCell
									subject={subject[1]}
									position="right"
								/>
							</td>
						</>
					)
				} else if (subject.length < 2) {
					return (
						<td
							className="border border-slate-700 relative h-full w-full"
							ref={drop}
						>
							{subject[0].name}
							<span onClick={handleRemove}>
								<MdDeleteForever />
							</span>
						</td>
					)
				}
			}
		} else {
			if (subject && teacher) {
				return (
					<td
						className="border border-slate-700 text-center relative h-full w-full"
						ref={drop}
					>
						<h4 className="inline">{teacher[0].shortname}</h4>
						<h4 className="text-primary inline ml-2">
							{subject[0].shortname}
						</h4>
						<span
							onClick={handleRemove}
							className="absolute top-1 right-1 cursor-pointer"
						>
							<MdDeleteForever />
						</span>
					</td>
				)
			} else if (subject) {
				return (
					<td
						className="border border-slate-700 text-center relative"
						ref={drop}
					>
						<h4 className="text-primary inline ml-2">
							{subject[0].shortname}
						</h4>
						<span
							onClick={handleRemove}
							className="absolute top-1 right-1 cursor-pointer"
						>
							<MdDeleteForever />
						</span>
					</td>
				)
			} else {
				return (
					<td
						className="border border-slate-700 h-full w-full"
						ref={drop}
					></td>
				)
			}
		}
	}

	return <>{renderCell()}</>
}

export default Cell
