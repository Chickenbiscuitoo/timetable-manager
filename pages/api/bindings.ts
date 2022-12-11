import type { NextApiRequest, NextApiResponse } from 'next'
import { Teacher, Class, Subject } from '@prisma/client'
import { prisma } from '../../server/client'

interface FormatedTeacher extends Teacher {
	lessons: number
}

interface FormatedBinding {
	id: number
	teachers: FormatedTeacher[]
	class: Class
	subject: Subject
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req

	if (method !== 'GET') {
		return res.status(400).json({ message: 'Only GET method allowed' })
	}

	try {
		const data = await prisma.binding.findMany({
			where: {
				id: 1,
			},
			include: {
				teachers: true,
				class: true,
				subject: true,
				BindingTeacherLessons: true,
			},
		})

		// map each binding from data and insert number of lessons each teacher teaches from BindingTeacherLessons into teachers object
		const updatedData: FormatedBinding[] = data.map((binding) => {
			const updatedTeachers = binding.teachers.map((teacher) => {
				const records = binding.BindingTeacherLessons.find(
					(entry) => entry.teacherId === teacher.id
				)

				return {
					...teacher,
					lessons: records ? records.lessons : 0,
				}
			})

			const updatedBinding = {
				...binding,
				teachers: updatedTeachers,
				BindingTeacherLessons: undefined,
				subjectId: undefined,
				classId: undefined,
			}

			return updatedBinding
		})

		return res.status(200).json(updatedData)
	} catch (error) {
		let message = 'Unknown Error'

		if (error instanceof Error) message = error.message
		else message = String(error)

		return res.status(500).json({ message })
	}
}

// Output:
// [
// 	{
// 		id: 1,
// 		teachers: [
// 			{
// 				id: 1,
// 				name: 'John Doe',
// 				shortname: 'JD',
// 				email: 'john.doe@gmail.com',
// 				lessons: 7,
// 			},
// 			{
// 				id: 2,
// 				name: 'Francis Muller',
// 				shortname: 'FM',
// 				email: 'francis.muller@gmail.com',
// 				lessons: 4,
// 			},
// 		],
// 		class: { id: 1, name: '1.A', grade: 1, teacherId: 1 },
// 		subject: {
// 			id: 4,
// 			name: 'Physics',
// 			shortname: 'PHY',
// 			commiteeId: 3,
// 		},
// 	},
// ]
