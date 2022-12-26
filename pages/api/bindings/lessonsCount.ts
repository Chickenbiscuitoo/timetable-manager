import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '../../../server/common/get-server-auth-session'

import { prisma } from '../../../server/client'
import { z } from 'zod'

const schemaPATCH = z.object({
	bindingId: z.number().int().positive(),
	teacherId: z.number().int().positive(),
	operation: z.string().refine(
		(value) => {
			return value === 'increment' || value === 'decrement'
		},
		{
			message: 'Operation must be either "increment" or "decrement"',
		}
	),
})

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerAuthSession({ req, res })

	if (!session) {
		res.send({
			error: 'You must be signed in to view the protected content on this page.',
		})
	}

	const { method } = req

	if (method !== 'PATCH') {
		return res.status(400).json({
			message: 'Only GET, PUT, DELETE and PATCH method allowed',
		})
	}

	try {
		const data = schemaPATCH.parse(req.body)

		if (data.operation === 'increment') {
			try {
				const response = await prisma.bindingTeacherLessons.update(
					{
						where: {
							bindingId_teacherId: {
								bindingId: data.bindingId,
								teacherId: data.teacherId,
							},
						},
						data: {
							lessons: { increment: 1 },
						},
					}
				)

				return res.status(200).json(response)
			} catch (error) {
				let message = 'Unknown Error'

				if (error instanceof Error) message = error.message
				else message = String(error)

				return res.status(500).json({ message })
			}
		} else if (data.operation === 'decrement') {
			try {
				const response = await prisma.bindingTeacherLessons.update(
					{
						where: {
							bindingId_teacherId: {
								bindingId: data.bindingId,
								teacherId: data.teacherId,
							},
						},
						data: {
							lessons: { decrement: 1 },
						},
					}
				)

				return res.status(200).json(response)
			} catch (error) {
				let message = 'Unknown Error'

				if (error instanceof Error) message = error.message
				else message = String(error)

				return res.status(500).json({ message })
			}
		}
	} catch (error) {
		let message = 'Unknown Error'

		if (error instanceof Error) message = error.message
		else message = String(error)

		return res.status(500).json({ message })
	}
}
