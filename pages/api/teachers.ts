import type { NextApiRequest, NextApiResponse } from 'next'
import { Teacher, Class, Subject } from '@prisma/client'
import { prisma } from '../../server/client'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req

	if (method !== 'GET') {
		return res.status(400).json({ message: 'Only GET method allowed' })
	}

	try {
		const data: Teacher[] = await prisma.teacher.findMany({})

		return res.status(200).json(data)
	} catch (error) {
		let message = 'Unknown Error'

		if (error instanceof Error) message = error.message
		else message = String(error)

		return res.status(500).json({ message })
	}
}
