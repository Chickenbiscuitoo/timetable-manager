import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../server/client'
import axios from 'axios'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req

	if (method !== 'GET') {
		return res.status(400).json({ message: 'Only GET method allowed' })
	}

	try {
		const data = await prisma.binding.findMany({
			include: {
				teachers: true,
				class: true,
				subject: true,
				BindingTeacherLessons: true,
			},
		})

		return res.status(200).json(data)
	} catch (error) {
		let message = 'Unknown Error'

		if (error instanceof Error) message = error.message
		else message = String(error)

		return res.status(500).json({ message })
	}
}
