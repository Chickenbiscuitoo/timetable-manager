import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '../../../server/common/get-server-auth-session'

import { prisma } from '../../../server/client'
import { Invite } from '@prisma/client'
import { z } from 'zod'

import axios from 'axios'

import cookie from 'cookie'

const schemaPOST = z.object({
	recipientEmail: z.string().email(),
	orgId: z.string().cuid(),
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

	if (!session.user) {
		return res.status(403).json({
			message: 'You must be signed in to invite',
		})
	} else if (!session.user.email) {
		return res.status(403).json({
			message: 'You must have an email address to invite',
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
			message:
				'You must be signed in to view the protected content on this page.',
		})
	}

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
				email: session.user.email,
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

		const organizationData = await prisma.organization.findUnique({
			where: {
				id: data.orgId,
			},
		})

		if (!organizationData || !senderData || !recipientData) {
			return res.status(404).json({
				message: 'Recipient is not a user of this application',
			})
		}

		function addDays(date: Date, days: number) {
			const result = new Date(date)
			result.setDate(result.getDate() + days)
			return result
		}

		const response = await prisma.invite.create({
			data: {
				senderEmail: session.user.email,
				recipientEmail: data.recipientEmail,
				organizationId: data.orgId,
				expires: addDays(new Date(), 2),
			},
		})

		const emailData = await axios.post(
			'https://api.emailjs.com/api/v1.0/email/send',
			{
				service_id: 'default_service',
				template_id: process.env.EMAILJS_TEMPLATE_ID,
				user_id: process.env.EMAILJS_USER_ID,
				accessToken: process.env.EMAILJS_ACCESS_TOKEN,
				template_params: {
					recipient_email: recipientData.email,
					recipient_name: recipientData.name,
					sender_name: senderData.name,
					organization_name: organizationData.name,
					invite_id: response.id,
				},
			}
		)

		return res.status(200).json({
			message: 'Invite sent',
			response,
		})
	} catch (error) {
		let message = 'Unknown Error'

		if (error instanceof Error) message = error.message
		else message = String(error)

		return res.status(500).json({ message })
	}
}
