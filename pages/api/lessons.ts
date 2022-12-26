import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '../../server/common/get-server-auth-session'

import { Lesson } from '@prisma/client'
import { prisma } from '../../server/client'
import { z } from 'zod'

import cookie from 'cookie'

const schemaPUT = z.object({
	classId: z.number().int().positive(),
	subjectId: z.number().int().positive(),
	day: z.number().int().positive(),
	period: z.number().int().positive(),
})

const schemaDELETE = z.object({
	id: z.number().int().positive(),
})

const schemaPATCH = z.object({
	id: z.number().int().positive(),
	teacherId: z.number().int().positive().optional(),
	subjectId: z.number().int().positive().optional(),
})

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
			const data = await prisma.lesson.findMany({
				where: {
					ownerId: userSession.userId,
				},
			})

			return res.status(200).json(data)
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else if (method === 'PUT') {
		try {
			const data = schemaPUT.parse(req.body)
			const response = await prisma.lesson.create({
				data: {
					ownerId: userSession.userId,
					classId: data.classId,
					subjects: {
						connect: {
							id: data.subjectId,
						},
					},
					day: data.day,
					period: data.period,
				},
			})

			return res.status(200).json({ message: response })
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
