import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../server/client'
import { z } from 'zod'

const schema = z.object({
	bindingId: z.number().int().positive(),
	teacherId: z.number().int().positive(),
})

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { method } = req

	if (method === 'PATCH') {
		try {
			const data = schema.parse(req.body)

			const responseTeacher = await prisma.binding.update({
				where: {
					id: data.bindingId,
				},
				data: {
					teachers: {
						connect: {
							id: data.teacherId,
						},
					},
				},
			})

			const responseBindingTeacherLessons =
				await prisma.bindingTeacherLessons.create({
					data: {
						bindingId: data.bindingId,
						teacherId: data.teacherId,
						lessons: 1,
					},
				})

			return res.status(200).json({
				message: 'Teacher added to binding',
				teacher: responseTeacher,
				bindingTeacherLessons: responseBindingTeacherLessons,
			})
		} catch (error) {
			let message = 'Unknown Error'

			if (error instanceof Error) message = error.message
			else message = String(error)

			return res.status(500).json({ message })
		}
	} else if (method === 'DELETE') {
		try {
			const data = schema.parse(req.body)

			const responseTeacher = await prisma.binding.update({
				where: {
					id: data.bindingId,
				},
				data: {
					teachers: {
						disconnect: {
							id: data.teacherId,
						},
					},
				},
			})

			const responseBindingTeacherLessons =
				await prisma.bindingTeacherLessons.delete({
					where: {
						bindingId_teacherId: {
							bindingId: data.bindingId,
							teacherId: data.teacherId,
						},
					},
				})

			return res.status(200).json({
				message: 'Teacher removed from binding',
				teacher: responseTeacher,
				bindingTeacherLessons: responseBindingTeacherLessons,
			})
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
