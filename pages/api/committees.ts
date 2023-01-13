import type { NextApiRequest, NextApiResponse } from 'next'
// import { getServerAuthSession } from '../../server/common/get-server-auth-session'

import { Committee } from '@prisma/client'
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

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// const session = await getServerAuthSession({ req, res })

	// if (!session) {
	// 	return res.status(403).send({
	// 		error: 'You must be signed in to view the protected content on this page.',
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
			error: 'You must be signed in to view the protected content on this page.',
		})
	}

	const { method } = req

	if (method === 'GET') {
		try {
			const reqData = schemaGET.parse(req.query)

			if (reqData.mode === 'personal') {
				const data = await prisma.committee.findMany({
					where: {
						ownerId: userSession.userId,
						organizationId: userSession.userId,
					},
				})

				return res.status(200).json(data)
			} else if (reqData.mode === 'organization') {
				if (!userSession.user.organizationId) {
					return res.status(400).json({
						message:
							'You are not a member of any organization',
					})
				}

				const data = await prisma.committee.findMany({
					where: {
						ownerId: userSession.userId,
						organizationId: userSession.user.organizationId,
					},
				})

				return res.status(200).json(data)
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
				const response = await prisma.committee.create({
					data: {
						name: data.name,
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

				const response = await prisma.committee.create({
					data: {
						name: data.name,
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
			const response = await prisma.committee.delete({
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
