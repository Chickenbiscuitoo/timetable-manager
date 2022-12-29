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
	id: z.number().int().positive(),
})

const schemaPATCH = z.object({
	orgId: z.number().int().positive(),
	userEmail: z.string().email(),
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
			const userData = await prisma.user.findUnique({
				where: { id: userSession.userId },
			})

			if (!userData) {
				return res.status(200).json({ message: 'User not found' })
			}

			if (!userData.organizationId) {
				return res.status(200).json({ message: 'No organization' })
			}

			const data = await prisma.organization.findUnique({
				where: { id: userData.organizationId },
			})

			return res.status(200).json(data)
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
			const data = schemaPATCH.parse(req.body)

			const user = await prisma.user.findUnique({
				where: { email: data.userEmail },
			})

			if (!user) {
				return res.status(200).json({ message: 'User not found' })
			}

			const response = await prisma.organization.update({
				where: {
					id: data.orgId,
				},
				data: {
					members: {
						connect: { id: user.id },
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
	} else {
		return res.status(400).json({
			message: 'Only GET, POST, DELETE and PATCH method allowed',
		})
	}
}
