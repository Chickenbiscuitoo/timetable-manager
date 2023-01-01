import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '../../server/common/get-server-auth-session'

import { Lesson, Teacher, Subject } from '@prisma/client'
import { prisma } from '../../server/client'
import { z } from 'zod'

import cookie from 'cookie'

const schemaGET = z.object({
	mode: z.string().refine(
		(value) => {
			return value === 'personal' || value === 'organization'
		},
		{
			message: 'Mode must be either "personal" or "organization"',
		}
	),
	schoolYear: z.string().min(9).max(16),
})

const schemaPUT = z.object({
	classId: z.number().int().positive(),
	subjectId: z.number().int().positive(),
	day: z.number().int().positive(),
	period: z.number().int().positive(),
	mode: z.string().refine(
		(value) => {
			return value === 'personal' || value === 'organization'
		},
		{
			message: 'Mode must be either "personal" or "organization"',
		}
	),
	schoolYear: z.string().min(9).max(16),
})

const schemaDELETE = z.object({
	id: z.number().int().positive(),
})

const schemaPATCH = z.object({
	id: z.number().int().positive(),
	teacherId: z.number().int().positive().optional(),
	subjectId: z.number().int().positive().optional(),
})

interface PopulatedLesson extends Lesson {
	subjects: Subject[]
	teachers: Teacher[]
}

type UpdatedLesson = Omit<Lesson, 'ownerId' | 'organizationId'>
type UpdatedTeacher = Omit<Teacher, 'ownerId' | 'organizationId'>
type UpdatedSubject = Omit<Subject, 'ownerId' | 'organizationId'>

// Exclude keys from lesson
function excludeFromLesson<Lesson, Key extends keyof Lesson>(
	lesson: Lesson,
	keys: Key[]
): Omit<Lesson, Key> {
	for (let key of keys) {
		delete lesson[key]
	}
	return lesson
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

// Exclude keys from teacher
function excludeFromTeacher<Teacher, Key extends keyof Teacher>(
	teacher: Teacher,
	keys: Key[]
): Omit<Teacher, Key> {
	for (let key of keys) {
		delete teacher[key]
	}
	return teacher
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerAuthSession({ req, res })

	if (!session) {
		return res.status(403).send({
			message:
				'You must be signed in to view the protected content on this page.',
		})
	}

	const cookies = cookie.parse(req.headers.cookie || '')
	const token =
		process.env.NODE_ENV == 'development'
			? cookies['next-auth.session-token']
			: cookies['__Secure-next-auth.session-token']

	const userSession = await prisma.session.findUnique({
		where: { sessionToken: token },
		include: {
			user: true,
		},
	})

	if (!userSession) {
		return res.status(403).send({
			message:
				'You must be signed in to view the protected content on this page.',
		})
	}

	const { method } = req

	if (method === 'GET') {
		try {
			const reqData = schemaGET.parse(req.query)

			if (reqData.mode === 'personal') {
				const data: PopulatedLesson[] =
					await prisma.lesson.findMany({
						where: {
							ownerId: userSession.userId,
							organizationId: userSession.userId,
							schoolYear: reqData.schoolYear,
						},
						include: {
							subjects: true,
							teachers: true,
						},
					})

				const updatedLessons: UpdatedLesson[] = data.map(
					(lesson) => ({
						...excludeFromLesson(lesson, [
							'ownerId',
							'organizationId',
						]),
						subjects: lesson.subjects.map((subject) =>
							excludeFromSubject(subject, [
								'ownerId',
								'organizationId',
							])
						),
						teachers: lesson.teachers.map((teacher) =>
							excludeFromTeacher(teacher, [
								'ownerId',
								'organizationId',
							])
						),
					})
				)

				return res.status(200).json(updatedLessons)
			} else if (reqData.mode === 'organization') {
				if (!userSession.user.organizationId) {
					return res.status(400).json({
						message: 'You are not a part of an organization',
					})
				}

				const data: PopulatedLesson[] =
					await prisma.lesson.findMany({
						where: {
							organizationId:
								userSession.user.organizationId,
							schoolYear: reqData.schoolYear,
						},
						include: {
							subjects: true,
							teachers: true,
						},
					})

				const updatedLessons: UpdatedLesson[] = data.map(
					(lesson) => ({
						...excludeFromLesson(lesson, [
							'ownerId',
							'organizationId',
						]),
						subjects: lesson.subjects.map((subject) =>
							excludeFromSubject(subject, [
								'ownerId',
								'organizationId',
							])
						),
						teachers: lesson.teachers.map((teacher) =>
							excludeFromTeacher(teacher, [
								'ownerId',
								'organizationId',
							])
						),
					})
				)

				return res.status(200).json(updatedLessons)
			}
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else if (method === 'PUT') {
		try {
			const data = schemaPUT.parse(req.body)

			if (data.mode === 'personal') {
				const response = await prisma.lesson.create({
					data: {
						ownerId: userSession.userId,
						organizationId: userSession.userId,
						classId: data.classId,
						subjects: {
							connect: {
								id: data.subjectId,
							},
						},
						day: data.day,
						period: data.period,
						schoolYear: data.schoolYear,
					},
				})

				return res.status(200).json({ message: response })
			} else if (data.mode === 'organization') {
				if (!userSession.user.organizationId) {
					return res.status(400).json({
						message: 'You are not a part of an organization',
					})
				}

				const response = await prisma.lesson.create({
					data: {
						ownerId: userSession.userId,
						organizationId: userSession.user.organizationId,
						classId: data.classId,
						subjects: {
							connect: {
								id: data.subjectId,
							},
						},
						day: data.day,
						period: data.period,
						schoolYear: data.schoolYear,
					},
				})

				return res.status(200).json({ message: response })
			}
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else if (method === 'PATCH') {
		try {
			const data = schemaPATCH.parse(req.body)

			if (data.teacherId && data.subjectId) {
				const response = await prisma.lesson.update({
					where: {
						id: data.id,
					},
					data: {
						teachers: {
							connect: {
								id: data.teacherId,
							},
						},
						subjects: {
							connect: {
								id: data.subjectId,
							},
						},
					},
				})

				return res.status(200).json({ message: response })
			} else if (data.teacherId && !data.subjectId) {
				const response = await prisma.lesson.update({
					where: {
						id: data.id,
					},
					data: {
						teachers: {
							connect: {
								id: data.teacherId,
							},
						},
					},
				})

				return res.status(200).json({ message: response })
			} else if (data.subjectId && !data.teacherId) {
				const response = await prisma.lesson.update({
					where: {
						id: data.id,
					},
					data: {
						subjects: {
							connect: {
								id: data.subjectId,
							},
						},
					},
				})

				return res.status(200).json({ message: response })
			}
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else if (method === 'DELETE') {
		try {
			const data = schemaDELETE.parse(req.body)
			const response = await prisma.lesson.delete({
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
		return res.status(400).json({
			message: 'Only GET, PUT and DELETE method allowed',
		})
	}
}
