import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../server/client'
import { Invite } from '@prisma/client'
import { z } from 'zod'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req
	const { id } = req.query

	if (method !== 'GET') {
		return res.status(400).json({
			message: 'Only GET method allowed',
		})
	}

	try {
		const inviteData = await prisma.invite.findUnique({
			where: {
				id: id as string,
			},
		})

		if (!inviteData) {
			return res.status(404).json({
				message: 'Invite not found',
			})
		} else if (inviteData.expires < new Date()) {
			return res.status(404).json({
				message: 'Invite expired',
			})
		}

		try {
			const recipientData = await prisma.user.findUnique({
				where: {
					email: inviteData.recipientEmail,
				},
			})

			if (!recipientData) {
				return res.status(404).json({
					message: 'Recipient not found',
				})
			}

			const orgResponse = await prisma.organization.update({
				where: {
					id: inviteData.organizationId,
				},
				data: {
					members: {
						connect: {
							id: recipientData.id,
						},
					},
				},
			})

			const inviteResponse = await prisma.invite.delete({
				where: {
					id: id as string,
				},
			})

			return res.status(200).json({
				message: 'Invite accepted',
				org: orgResponse,
				invite: inviteResponse,
			})
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} catch (error) {
		let message = 'Unknown Error'

		if (error instanceof Error) message = error.message
		else message = String(error)

		return res.status(500).json({ message })
	}
}
