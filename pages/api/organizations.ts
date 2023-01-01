import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '../../server/common/get-server-auth-session'

import { prisma } from '../../server/client'
import { Organization } from '@prisma/client'

import { z } from 'zod'

import cookie from 'cookie'

const schemaPOST = z.object({
	name: z.string().min(3).max(255),
})

const schemaDELETE = z.object({
	id: z.string().cuid(),
})

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
			if (!userSession.user.organizationId) {
				return res.status(200).json({ message: 'No organization' })
			}

			const data = await prisma.organization.findUnique({
				where: { id: userSession.user.organizationId },
				include: {
					_count: {
						select: {
							members: true,
						},
					},
				},
			})

			if (!data) {
				return res
					.status(200)
					.json({ message: 'Organization not found' })
			}

			const formatedData = {
				id: data.id,
				name: data.name,
				members: data._count.members,
			}

			return res.status(200).json(formatedData)
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else if (method === 'POST') {
		try {
			const data = schemaPOST.parse(req.body)
			const response = await prisma.organization.create({
				data: {
					name: data.name,
					members: {
						connect: { id: userSession.userId },
					},
				},
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
			const response = await prisma.organization.delete({
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
			if (!userSession.user.organizationId) {
				return res.status(200).json({ message: 'No organization' })
			}

			const response = await prisma.organization.update({
				where: {
					id: userSession.user.organizationId,
				},
				data: {
					members: {
						disconnect: { id: userSession.userId },
					},
				},
				include: {
					_count: {
						select: {
							members: true,
						},
					},
				},
			})

			if (response._count.members == 0) {
				await prisma.organization.delete({
					where: {
						id: response.id,
					},
				})
			}

			return res.status(200).json({ message: response })
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else {
		return res.status(400).json({
			message: 'Only GET, POST, DELETE and PATCH method allowed',
		})
	}
}
