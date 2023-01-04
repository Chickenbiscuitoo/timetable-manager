import type { NextApiRequest, NextApiResponse } from 'next'
import { Class, Subject, Teacher } from '@prisma/client'

import { getServerAuthSession } from '../../../server/common/get-server-auth-session'

import { prisma } from '../../../server/client'
import { z } from 'zod'

import cookie from 'cookie'
import axios from 'axios'

const schemaPOST = z.object({
	mode: z.string().refine(
		(value) => {
			return value === 'personal' || value === 'organization'
		},
		{
			message: 'Mode must be either "personal" or "organization"',
		}
	),
	schoolYear: z.string().min(9).max(16),
})

type ClassWithoutIds = Omit<Class, 'ownerId' | 'organizationId'>
type SubjectWithoutIds = Omit<Subject, 'ownerId' | 'organizationId'>

interface BindingTeacher {
	id: number
	name: string
	shortname: string
	email: string
	lessons: number
}

interface UpdatedBinding {
	id: number
	teacher: BindingTeacher
	class: ClassWithoutIds
	subject: SubjectWithoutIds
}

interface UpdatedTeacher {
	id: number
	name: string
	shortname: string
	email: string
	bindings: UpdatedBinding[]
	totalLessons: number
}

// Exclude keys from subject
function excludeFromSubject<Subject, Key extends keyof Subject>(
	subject: Subject,
	keys: Key[]
): Omit<Subject, Key> {
	for (let key of keys) {
		delete subject[key]
	}
	return subject
}

// Exclude keys from class
function excludeFromClass<Class, Key extends keyof Class>(
	cl: Class,
	keys: Key[]
): Omit<Class, Key> {
	for (let key of keys) {
		delete cl[key]
	}
	return cl
}

function createTeacherHtmlCard(teacher: UpdatedTeacher) {
	const style = `<style type="text/css">
    .tg  {border-collapse:collapse;border-color:#ccc;border-spacing:0;margin:0px auto;}
    .tg td{background-color:#fff;border-color:#ccc;border-style:solid;border-width:1px;color:#333;
      font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:15px;word-break:normal;}
    .tg th{background-color:#f0f0f0;border-color:#ccc;border-style:solid;border-width:1px;color:#333;
      font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:15px;word-break:normal;}
    .tg .tg-c3ow{border-color:inherit;text-align:center;vertical-align:top}
    .tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
    </style>`

	const bindingCellsHtml = teacher.bindings
		.map(
			(binding) =>
				`<td class="tg-c3ow" style="background-color:#fff; border-color:inherit; border-style:solid; border-width:1px; color:#333; font-family:Arial, sans-serif; font-size:14px; overflow:hidden; padding:15px; word-break:normal; text-align:center; vertical-align:top" bgcolor="#ffffff" align="center" valign="top">
                    <h3>${binding.class.name}</h3>
                    <h2>${binding.subject.shortname}</h2>
                    <h3>${binding.teacher.lessons}h</h3>
                </td>`
		)
		.join('')

	const teacherCardHtml = `
        ${style}
        <table style="border-collapse:collapse; border-color:#ccc; border-spacing:0; margin:0 auto">
            <tbody>
                <tr>
                    <td class="tg-c3ow" style="background-color:#fff; border-color:inherit; border-style:solid; border-width:1px; color:#333; font-family:Arial, sans-serif; font-size:14px; overflow:hidden; padding:15px; word-break:normal; text-align:center; vertical-align:middle" bgcolor="#ffffff" align="center" valign="top">
                        <h1>${teacher.shortname}</h1>
                    </td>
                    <td class="tg-c3ow" style="background-color:#fff; border-color:inherit; border-style:solid; border-width:1px; color:#333; font-family:Arial, sans-serif; font-size:14px; overflow:hidden; padding:15px; word-break:normal; text-align:center; vertical-align:middle" bgcolor="#ffffff" align="center" valign="top">
                        <h1>${teacher.totalLessons}h</h1>
                    </td>
                    ${bindingCellsHtml}
                </tr>
            </tbody>
        </table>
    `
	return teacherCardHtml
}

async function sendEmailToTeacher(
	senderName: string,
	teacherName: string,
	teacherEmail: string,
	schoolYear: string,
	htmlCard: string
) {
	const emailData = await axios.post(
		'https://api.emailjs.com/api/v1.0/email/send',
		{
			service_id: 'default_service',
			template_id: process.env.EMAILJS_TEMPLATE_ID2,
			user_id: process.env.EMAILJS_USER_ID,
			accessToken: process.env.EMAILJS_ACCESS_TOKEN,
			template_params: {
				sender_name: senderName,
				teacher_name: teacherName,
				teacher_email: teacherEmail,
				school_year: schoolYear,
				html_card: htmlCard,
			},
		}
	)

	return emailData
}

// Temporary function to check if user is eligible to use the api endpoint
function checkUserPermissions(userEmail: string) {
	const userEmailDomain = userEmail.split('@')[1]
	const allowedEmails = process.env.ALLOWED_EMAILS?.split(', ')

	if (
		userEmailDomain === 'spseke.sk' ||
		allowedEmails?.includes(userEmail)
	) {
		return true
	} else {
		return false
	}
}

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

	const cookies = cookie.parse(req.headers.cookie || '')
	const token =
		process.env.NODE_ENV == 'development'
			? cookies['next-auth.session-token']
			: cookies['__Secure-next-auth.session-token']

	const userSession = await prisma.session.findUnique({
		where: { sessionToken: token },
		include: {
			user: true,
		},
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

	if (!checkUserPermissions(session.user?.email || '')) {
		return res.status(403).json({
			message: 'You do not have permission to use this feature',
		})
	}

	try {
		const data = schemaPOST.parse(req.body)

		let activeTeachers

		if (data.mode === 'personal') {
			const teachers = await prisma.teacher.findMany({
				where: {
					ownerId: userSession.userId,
					organizationId: userSession.userId,
					NOT: {
						bindings: {
							none: {},
						},
					},
				},
				include: {
					bindings: {
						include: {
							class: true,
							teachers: true,
							subject: true,
							BindingTeacherLessons: true,
						},
					},
				},
			})

			activeTeachers = teachers
		} else if (data.mode === 'organization') {
			if (!userSession.user.organizationId) {
				return res.status(400).json({
					message: 'You are not a member of any organization',
				})
			}

			const teachers = await prisma.teacher.findMany({
				where: {
					ownerId: userSession.userId,
					organizationId: userSession.user.organizationId,
					NOT: {
						bindings: {
							none: {},
						},
					},
				},
				include: {
					bindings: {
						include: {
							class: true,
							teachers: true,
							subject: true,
							BindingTeacherLessons: true,
						},
					},
				},
			})

			activeTeachers = teachers
		}

		if (!activeTeachers) {
			return res.status(400).json({
				message: 'No active teachers found',
			})
		}

		const updatedTeachers: UpdatedTeacher[] = activeTeachers.map(
			(teacher) => {
				const updatedBindings: UpdatedBinding[] =
					teacher.bindings.map((binding) => {
						const bindingTeacherLessonsCount =
							binding.BindingTeacherLessons.find(
								(t) => t.teacherId === teacher.id
							)?.lessons

						const updatedTeacher: BindingTeacher = {
							id: teacher.id,
							name: teacher.name,
							shortname: teacher.shortname,
							email: teacher.email,
							lessons: bindingTeacherLessonsCount || 0,
						}

						return {
							id: binding.id,
							class: excludeFromClass(binding.class, [
								'ownerId',
								'organizationId',
							]),
							subject: excludeFromSubject(binding.subject, [
								'ownerId',
								'organizationId',
							]),
							teacher: updatedTeacher,
						}
					})

				const teacherTotalLessons = updatedBindings.reduce(
					(acc, binding) => acc + binding.teacher.lessons,
					0
				)

				return {
					id: teacher.id,
					name: teacher.name,
					shortname: teacher.shortname,
					email: teacher.email,
					bindings: updatedBindings,
					totalLessons: teacherTotalLessons,
				}
			}
		)

		for (let i = 0; i < updatedTeachers.length; i++) {
			const teacher = updatedTeachers[i]
			const htmlCard = createTeacherHtmlCard(teacher)
			const senderName = userSession.user.name
			const tchName = teacher.name
			const tchEmail = teacher.email
			const schoolYear = data.schoolYear

			if (
				!senderName ||
				!tchName ||
				!tchEmail ||
				!schoolYear ||
				!htmlCard
			) {
				return res.status(400).json({
					message: 'Operation failed',
				})
			}

			await sendEmailToTeacher(
				senderName,
				tchName,
				tchEmail,
				schoolYear,
				htmlCard
			)
		}

		return res.status(200).json({ message: 'Operation successful' })
	} catch (error) {
		let message = 'Unknown Error'

		if (error instanceof Error) message = error.message
		else message = String(error)

		return res.status(500).json({ message })
	}
}
