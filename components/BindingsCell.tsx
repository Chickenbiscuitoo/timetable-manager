import type { NextPage } from 'next'
import { Class, Subject, Teacher } from '@prisma/client'

import { useState } from 'react'

import useTimetableStore from '../store'
import { useDrop } from 'react-dnd'

import { MdDeleteForever } from 'react-icons/md'
import { AiOutlinePlus } from 'react-icons/ai'
import { AiOutlineMinus } from 'react-icons/ai'

interface Props {
	bindingId: number
	cl: {
		id: number
		name: string
		teacher_id: number
		grade: number
	}
	subject: Subject
	teachers: {
		id: number
		name: string
		shortname: string
		email: string
		lessons: number
	}[]
}

const BindingsCell: NextPage<Props> = ({
	bindingId,
	cl,
	subject,
	teachers,
}) => {
	const {
		addBinding,
		deleteBinding,
		addTeacherToBinding,
		updateBindingLessonCount,
		deleteTeacherFromBinding,
		subjects,
		classes,
	} = useTimetableStore()

	const [hovered, setHovered] = useState(false)

	const handleDrop = () => {
		const { teacherId } = itemProps

		if (bindingId === undefined) {
			const subjectId = subject.id
			const classId = cl.id
			addBinding(teacherId, subjectId, classId)
		} else {
			addTeacherToBinding(bindingId, teacherId)
		}
	}

	const teacherIds = teachers?.map((t) => t.id)
	const handleCanDrop = () => {
		if (teacherIds.includes(itemProps?.teacherId)) {
			return false
		} else {
			return true
		}
	}

	const [{ isOver, canDrop, itemType, itemProps }, drop]: any = useDrop({
		accept: ['TeacherBindingsItem'],
		canDrop: handleCanDrop,
		drop: handleDrop,
		collect: (monitor) => ({
			canDrop: !!monitor.canDrop(),
			isOver: !!monitor.isOver(),
			itemType: monitor.getItemType(),
			itemProps: monitor.getItem(),
		}),
	})

	const getTotalLessons = () => {
		let total = 0
		teachers?.forEach((teacher) => {
			total += teacher.lessons
		})
		return total > 0 ? total : ''
	}

	return (
		<td
			className={`border border-slate-600 h-full w-full ${
				isOver && canDrop && '!bg-emerald-200'
			} ${isOver && !canDrop && '!bg-rose-200'}`}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			ref={drop}
		>
			<div className="h-full w-full flex flex-row">
				<div className="flex-1 flex flex-col">
					{teachers?.map((teacher, i) => (
						<div
							key={teacher.id}
							className="h-full w-full flex items-center"
						>
							<h4 className="inline relative">
								{hovered && (
									<>
										<span
											className="w-full absolute top-1 right-4 cursor-pointer hover:text-red-400"
											onClick={() =>
												deleteTeacherFromBinding(
													bindingId,
													teacher.id
												)
											}
										>
											<MdDeleteForever />
										</span>
										<span className="w-full absolute top-1 left-9 cursor-pointer text-xs">
											<AiOutlinePlus
												className="hover:text-emerald-400"
												onClick={() =>
													updateBindingLessonCount(
														bindingId,
														teacher.id,
														'increment'
													)
												}
											/>
											<AiOutlineMinus
												className="hover:text-red-400"
												onClick={() =>
													updateBindingLessonCount(
														bindingId,
														teacher.id,
														'decrement'
													)
												}
											/>
										</span>
									</>
								)}
								{teachers[i]?.shortname}
							</h4>
							<h4 className="text-primary inline ml-1">
								{teachers[i]?.lessons}
							</h4>
						</div>
					))}
				</div>
				<div className="text-primary flex place-content-right items-center">
					{getTotalLessons()}
				</div>
			</div>
		</td>
	)
}

export default BindingsCell
