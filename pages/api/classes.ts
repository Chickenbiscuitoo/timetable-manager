import type { NextApiRequest, NextApiResponse } from 'next'
// import { getServerAuthSession } from '../../server/common/get-server-auth-session'

import { Class, Teacher } from '@prisma/client'
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
})

const schemaPUT = z.object({
	name: z.string().min(3).max(128),
	grade: z.number().int().positive(),
	teacherId: z.number().int().positive(),
	mode: z.string().refine(
		(value) => {
			return value === 'personal' || value === 'organization'
		},
		{
			message: 'Mode must be either "personal" or "organization"',
		}
	),
})

const schemaDELETE = z.object({
	id: z.number().int().positive(),
})

const schemaPATCH = z.object({
	id: z.number().int().positive(),
	name: z.string().min(3).max(128),
	grade: z.number().int().positive(),
	teacherId: z.number().int().positive(),
})

type UpdatedClass = Omit<Class, 'teacherId' | 'organizationId' | 'ownerId'>

interface PopulatedClass extends Class {
	teacher: Teacher
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
	// const session = await getServerAuthSession({ req, res })

	// if (!session) {
	// 	return res.status(403).send({
	// 		message:
	// 			'You must be signed in to view the protected content on this page.',
	// 	})
	// }

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
				const data: PopulatedClass[] = await prisma.class.findMany(
					{
						where: {
							ownerId: userSession.userId,
							organizationId: userSession.userId,
						},
						include: {
							teacher: true,
						},
					}
				)

				// Excluded TeacherId field from teacher
				const updatedClasses: UpdatedClass[] = data.map((cl) => ({
					...excludeFromClass(cl, [
						'teacherId',
						'organizationId',
						'ownerId',
					]),
					teacher: excludeFromTeacher(cl.teacher, [
						'organizationId',
						'ownerId',
					]),
				}))

				return res.status(200).json(updatedClasses)
			} else if (reqData.mode === 'organization') {
				if (!userSession.user.organizationId) {
					return res.status(400).json({
						message:
							'You are not a member of any organization',
					})
				}

				const data: PopulatedClass[] = await prisma.class.findMany(
					{
						where: {
							organizationId:
								userSession.user.organizationId,
						},
						include: {
							teacher: true,
						},
					}
				)

				// Excluded TeacherId field from teacher
				const updatedClasses: UpdatedClass[] = data.map((cl) => ({
					...excludeFromClass(cl, [
						'teacherId',
						'organizationId',
						'ownerId',
					]),
					teacher: excludeFromTeacher(cl.teacher, [
						'organizationId',
						'ownerId',
					]),
				}))

				return res.status(200).json(updatedClasses)
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
				const response = await prisma.class.create({
					data: {
						name: data.name,
						grade: data.grade,
						teacherId: data.teacherId,
						ownerId: userSession.userId,
						organizationId: userSession.userId,
					},
				})

				return res.status(200).json({ message: response })
			} else if (data.mode === 'organization') {
				if (!userSession.user.organizationId) {
					return res.status(400).json({
						message:
							'You are not a member of any organization',
					})
				}

				const response = await prisma.class.create({
					data: {
						name: data.name,
						grade: data.grade,
						teacherId: data.teacherId,
						ownerId: userSession.userId,
						organizationId: userSession.user.organizationId,
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
			const response = await prisma.class.delete({
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
	} else if (method === 'PATCH') {
		try {
			const data = schemaPATCH.parse(req.body)
			const response = await prisma.class.update({
				where: {
					id: data.id,
				},
				data: {
					name: data.name,
					grade: data.grade,
					teacherId: data.teacherId,
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
			message: 'Only GET, PUT, DELETE and PATCH method allowed',
		})
	}
}
