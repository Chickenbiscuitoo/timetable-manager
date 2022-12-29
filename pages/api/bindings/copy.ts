import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '../../../server/common/get-server-auth-session'

import { Binding } from '@prisma/client'
import { prisma } from '../../../server/client'
import { z } from 'zod'

import cookie from 'cookie'

const schemaPATCH = z.object({
	srcClassId: z.number().positive(),
	destClassId: z.number().positive(),
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

	if (method !== 'PATCH') {
		return res
			.status(400)
			.json({ message: 'Only PATCH method allowed' })
	}

	try {
		const data = schemaPATCH.parse(req.body)

		const srcClassBindings: Binding[] = await prisma.binding.findMany({
			where: {
				classId: data.srcClassId,
				ownerId: userSession.userId,
			},
		})

		if (!srcClassBindings) {
			return res.status(404).json({ message: 'No bindings found' })
		}

		const response = await prisma.binding.createMany({
			data: srcClassBindings.map((binding) => ({
				...binding,
				classId: data.destClassId,
			})),
			skipDuplicates: true,
		})

		return res.status(200).json(response)
	} catch (error) {
		let message = 'Unknown Error'

		if (error instanceof Error) message = error.message
		else message = String(error)

		return res.status(500).json({ message })
	}
}
