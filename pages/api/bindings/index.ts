import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '../../../server/common/get-server-auth-session'

import { Teacher, Class, Subject } from '@prisma/client'
import { prisma } from '../../../server/client'
import { z } from 'zod'

import cookie from 'cookie'

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

type TeacherWithoutOwnerId = Omit<
	FormatedTeacher,
	'ownerId' | 'organizationId'
>
type FormatedClass = Omit<Class, 'ownerId' | 'organizationId'>
type FormatedSubject = Omit<Subject, 'ownerId' | 'organizationId'>

interface FormatedBinding {
	id: number
	teachers: TeacherWithoutOwnerId[]
	class: FormatedClass
	subject: FormatedSubject
}

// Exclude keys from subject
function excludeFromSubject<Subject, Key extends keyof Subject>(
	subject: Subject,
	keys: Key[]
): Omit<Subject, Key> {
	for (let key of keys) {
		delete subject[key]
	}
	return subject
}

// Exclude keys from class
function excludeFromClass<Class, Key extends keyof Class>(
	cl: Class,
	keys: Key[]
): Omit<Class, Key> {
	for (let key of keys) {
		delete cl[key]
	}
	return cl
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerAuthSession({ req, res })

	if (!session) {
		return res.status(403).send({
			error: 'You must be signed in to view the protected content on this page.',
		})
	}

	const cookies = cookie.parse(req.headers.cookie || '')
	const token =
		process.env.NODE_ENV == 'development'
			? cookies['next-auth.session-token']
			: cookies['__Secure-next-auth.session-token']

	const userSession = await prisma.session.findUnique({
		where: { sessionToken: token },
	})

	if (!userSession) {
		return res.status(403).send({
			error: 'You must be signed in to view the protected content on this page.',
		})
	}

	const { method } = req

	if (method === 'GET') {
		try {
			const data = await prisma.binding.findMany({
				where: {
					ownerId: userSession.userId,
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
						ownerId: undefined,
						organizationId: undefined,
						lessons: records ? records.lessons : 0,
					}
				})

				const updatedBinding = {
					...binding,
					teachers: updatedTeachers,
					class: excludeFromClass(binding.class, [
						'ownerId',
						'organizationId',
					]),
					subject: excludeFromSubject(binding.subject, [
						'ownerId',
						'organizationId',
					]),
					BindingTeacherLessons: undefined,
					subjectId: undefined,
					classId: undefined,
					ownerId: undefined,
					organizationId: undefined,
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
					ownerId: userSession.userId,
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
