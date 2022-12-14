import type { NextApiRequest, NextApiResponse } from 'next'
import { Class } from '@prisma/client'
import { prisma } from '../../server/client'

type updatedClass = Omit<Class, 'teacherId'>

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req

	if (method !== 'GET') {
		return res.status(400).json({ message: 'Only GET method allowed' })
	}

	try {
		const data: Class[] = await prisma.class.findMany({
			include: {
				teacher: true,
			},
		})

		// Excluded TeacherId field from teacher
		const updatedClasses: updatedClass[] = data.map((item) => ({
			...item,
			teacherId: undefined,
		}))

		return res.status(200).json(updatedClasses)
	} catch (error) {
		let message = 'Unknown Error'

		if (error instanceof Error) message = error.message
		else message = String(error)

		return res.status(500).json({ message })
	}
}
