import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../server/client'
import { Invite } from '@prisma/client'
import { z } from 'zod'

const schemaPOST = z.object({
	senderEmail: z.string().email(),
	recipientEmail: z.string().email(),
	orgId: z.number().int().positive(),
})

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req

	if (method !== 'POST') {
		return res.status(400).json({
			message: 'Only POST method allowed',
		})
	}

	try {
		const data = schemaPOST.parse(req.body)

		const senderData = await prisma.user.findUnique({
			where: {
				email: data.senderEmail,
			},
		})

		if (senderData?.organizationId !== data.orgId) {
			return res.status(403).json({
				message:
					'You are not authorized to invite to this organization',
			})
		}

		const recipientData = await prisma.user.findUnique({
			where: {
				email: data.recipientEmail,
			},
		})

		if (recipientData?.organizationId === data.orgId) {
			return res.status(403).json({
				message:
					'Recipient is already a member of this organization',
			})
		}

		function addDays(date: Date, days: number) {
			const result = new Date(date)
			result.setDate(result.getDate() + days)
			return result
		}

		const response = await prisma.invite.create({
			data: {
				senderEmail: data.senderEmail,
				recipientEmail: data.recipientEmail,
				organizationId: data.orgId,
				expires: addDays(new Date(), 2),
			},
		})

		return res.status(200).json(response)
	} catch (error) {
		let message = 'Unknown Error'

		if (error instanceof Error) message = error.message
		else message = String(error)

		return res.status(500).json({ message })
	}
}
