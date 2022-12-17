import type { NextApiRequest, NextApiResponse } from 'next'
import { Subject } from '@prisma/client'
import { prisma } from '../../server/client'
import { z } from 'zod'

const schemaPUT = z.object({
	name: z.string().min(3).max(255),
	shortname: z.string().min(2).max(8),
	commiteeId: z.number().int().positive(),
})

const schemaDELETE = z.object({
	id: z.number().int().positive(),
})

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req

	if (method === 'GET') {
		try {
			const data: Subject[] = await prisma.subject.findMany({})

			return res.status(200).json(data)
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else if (method === 'PUT') {
		try {
			const data = schemaPUT.parse(req.body)
			const response = await prisma.subject.create({
				data: {
					name: data.name,
					shortname: data.shortname,
					commiteeId: data.commiteeId,
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
			const response = await prisma.subject.delete({
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
	} else {
		return res
			.status(400)
			.json({ message: 'Only GET and PUT method allowed' })
	}
}
