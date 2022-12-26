import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '../../../server/common/get-server-auth-session'

import { Teacher, Class, Subject } from '@prisma/client'
import { prisma } from '../../../server/client'
import { z } from 'zod'

const schemaPUT = z.object({
	teachers: z.array(z.number().int().positive()),
	classId: z.number().int().positive(),
	subjectId: z.number().int().positive(),
	bindingTeacherLessons: z.array(
		z.object({
			teacherId: z.number().int().positive(),
			lessons: z.number().int().positive(),
		})
	),
})

const schemaDELETE = z.object({
	id: z.number().int().positive(),
})

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
	const session = await getServerAuthSession({ req, res })

	if (session) {
		res.send({
			content:
				'This is protected content. You can access this content because you are signed in.',
		})
	} else {
		res.send({
			error: 'You must be signed in to view the protected content on this page.',
		})
	}

	const { method } = req

	if (method === 'GET') {
		try {
			const data = await prisma.binding.findMany({
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
	} else if (method === 'PUT') {
		try {
			const data = schemaPUT.parse(req.body)
			const response = await prisma.binding.create({
				data: {
					classId: data.classId,
					subjectId: data.subjectId,
					teachers: {
						connect: data.teachers.map((id) => ({ id })),
					},
				},
			})

			await prisma.bindingTeacherLessons.createMany({
				data: data.bindingTeacherLessons.map((entry) => ({
					lessons: entry.lessons,
					teacherId: entry.teacherId,
					bindingId: response.id,
				})),
			})

			return res.status(200).json({ message: response })
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else if (method === 'DELETE') {
		try {
			const data = schemaDELETE.parse(req.body)
			const response = await prisma.binding.delete({
				where: {
					id: data.id,
				},
			})

			return res.status(200).json({ message: response })
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else {
		return res
			.status(400)
			.json({ message: 'Only GET, PUT and DELETE method allowed' })
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
