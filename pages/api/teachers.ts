import type { NextApiRequest, NextApiResponse } from 'next'
import { Teacher } from '@prisma/client'
import { prisma } from '../../server/client'
import { z } from 'zod'

const schemaPUT = z.object({
	name: z.string().min(3).max(128),
	shortname: z.string().min(2).max(8),
	email: z.string().email(),
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
			const data: Teacher[] = await prisma.teacher.findMany({})

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
			const response = await prisma.teacher.create({
				data: {
					name: data.name,
					shortname: data.shortname,
					email: data.email,
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
			const response = await prisma.teacher.delete({
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
