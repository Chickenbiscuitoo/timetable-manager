import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '../../server/common/get-server-auth-session'

import { prisma } from '../../server/client'
import { Organization } from '@prisma/client'

import { z } from 'zod'

const schemaPOST = z.object({
	name: z.string().min(3).max(255),
})

const schemaDELETE = z.object({
	id: z.number().int().positive(),
})

const schemaPATCH = z.object({
	orgId: z.number().int().positive(),
	userId: z.string().min(3),
})

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
			const data: Organization[] =
				await prisma.organization.findMany({
					include: {
						members: true,
					},
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
			const response = await prisma.organization.update({
				where: {
					id: data.orgId,
				},
				data: {
					members: {
						connect: { id: data.userId },
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
