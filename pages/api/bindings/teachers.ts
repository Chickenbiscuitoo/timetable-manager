import type { NextApiRequest, NextApiResponse } from 'next'
// import { getServerAuthSession } from '../../../server/common/get-server-auth-session'
import { prisma } from '../../../server/client'
import { z } from 'zod'

import cookie from 'cookie'

const schema = z.object({
	bindingId: z.number().int().positive(),
	teacherId: z.number().int().positive(),
})

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// const session = await getServerAuthSession({ req, res })

	// if (!session) {
	// 	res.send({
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

	if (method === 'PATCH') {
		try {
			const data = schema.parse(req.body)

			const responseTeacher = await prisma.binding.update({
				where: {
					id: data.bindingId,
				},
				data: {
					teachers: {
						connect: {
							id: data.teacherId,
						},
					},
				},
			})

			const responseBindingTeacherLessons =
				await prisma.bindingTeacherLessons.create({
					data: {
						bindingId: data.bindingId,
						teacherId: data.teacherId,
						lessons: 1,
					},
				})

			return res.status(200).json({
				message: 'Teacher added to binding',
				teacher: responseTeacher,
				bindingTeacherLessons: responseBindingTeacherLessons,
			})
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else if (method === 'DELETE') {
		try {
			const data = schema.parse(req.body)

			const responseTeacher = await prisma.binding.update({
				where: {
					id: data.bindingId,
				},
				data: {
					teachers: {
						disconnect: {
							id: data.teacherId,
						},
					},
				},
				include: {
					teachers: true,
				},
			})

			const responseBindingTeacherLessons =
				await prisma.bindingTeacherLessons.delete({
					where: {
						bindingId_teacherId: {
							bindingId: data.bindingId,
							teacherId: data.teacherId,
						},
					},
				})

			if (responseTeacher.teachers.length === 0) {
				await prisma.binding.delete({
					where: {
						id: data.bindingId,
					},
				})
			}

			return res.status(200).json({
				message: 'Teacher removed from binding',
				binding: responseTeacher,
				bindingTeacherLessons: responseBindingTeacherLessons,
			})
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
