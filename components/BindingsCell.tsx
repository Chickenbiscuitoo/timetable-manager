import type { NextPage } from 'next'
import { Class, Subject, Teacher } from '@prisma/client'

import { useState } from 'react'

import useTimetableStore from '../store'
import { useDrop } from 'react-dnd'

import SplitCell from './SplitCell'
import { MdDeleteForever } from 'react-icons/md'

interface Props {
	cl: Class
	subject: Subject
	teachers: Teacher[]
	lessons: number
}

const BindingsCell: NextPage<Props> = ({
	cl,
	subject,
	teachers,
	lessons,
}) => {
	const renderCell = () => {
		if (teachers?.length === 1) {
			return (
				<td className="border border-slate-600 h-full w-full">
					<h4 className="inline">{teachers[0]?.shortname}</h4>
					<h4 className="text-primary inline">{lessons}</h4>
				</td>
			)
		} else if (teachers?.length > 1) {
			return (
				<td className="border border-slate-600 h-full w-full grid grid-cols-2">
					<div className="flex flex-col">
						{teachers.map((teacher, i) => (
							<div className="w-1/2 h-full text-center top-1">
								<h4 className="inline">
									{teachers[i]?.shortname}
								</h4>
								<h4 className="text-primary inline">
									{lessons}
								</h4>
							</div>
						))}
					</div>
					<div
						className="text-primary w-full h-full flex place-content-center items-center
                    "
					>
						{lessons}
					</div>
				</td>
			)
		} else {
			return (
				<td className="border border-slate-600 h-full w-full"></td>
			)
		}
	}

	return <>{renderCell()}</>
}

export default BindingsCell
