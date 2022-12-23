import type { NextApiRequest, NextApiResponse } from 'next'
import { Class } from '@prisma/client'
import { prisma } from '../../server/client'
import { z } from 'zod'

const schemaPUT = z.object({
	name: z.string().min(3).max(128),
	grade: z.number().int().positive(),
	teacherId: z.number().int().positive(),
})

const schemaDELETE = z.object({
	id: z.number().int().positive(),
})

const schemaPATCH = z.object({
	id: z.number().int().positive(),
	name: z.string().min(3).max(128),
	grade: z.number().int().positive(),
	teacherId: z.number().int().positive(),
})

type updatedClass = Omit<Class, 'teacherId'>

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req

	if (method === 'GET') {
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
	} else if (method === 'PUT') {
		try {
			const data = schemaPUT.parse(req.body)
			const response = await prisma.class.create({
				data: {
					name: data.name,
					grade: data.grade,
					teacherId: data.teacherId,
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
			const response = await prisma.class.delete({
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
	} else if (method === 'PATCH') {
		try {
			const data = schemaPATCH.parse(req.body)
			const response = await prisma.class.update({
				where: {
					id: data.id,
				},
				data: {
					name: data.name,
					grade: data.grade,
					teacherId: data.teacherId,
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
		return res.status(400).json({
			message: 'Only GET, PUT, DELETE and PATCH method allowed',
		})
	}
}
