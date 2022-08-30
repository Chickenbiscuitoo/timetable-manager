import { Class, Subject, Teacher } from '@prisma/client'
import {
	getDayFromPosition,
	getPeriodFromPosition,
} from './utils/getPosition'

import create from 'zustand'

interface TimetableState {
	rawTableData: {
		id?: number
		class: number
		day: number
		period: number
		teachers?: Teacher[] | undefined
		subjects: Subject[]
	}[]
	teachers: Teacher[]
	subjects: Subject[]
	classes: Class[]

	addLesson: (
		class_id: number,
		position: number,
		subject: Subject[],
		teacher?: Teacher[]
	) => void
	updateLesson: (
		class_id: number,
		position: number,
		subject: Subject[],
		teacher?: Teacher[] | undefined
	) => void
	deleteLesson: (class_id: number, position: number) => void
	copyLessons: (from: number, to: number) => void

	selectedClass: number
	setSelectedClass: (class_id: number) => void
}

const useTimetableStore = create<TimetableState>((set, get) => ({
	rawTableData: [
		{
			id: 2,
			class: 9,
			day: 1,
			period: 1,
			teachers: [
				{
					id: 3,
					name: 'Gulami Bete',
					shortname: 'GB',
					email: 'gulami.bete@gmail.com',
				},
			],
			subjects: [
				{
					id: 3,
					name: 'History',
					shortname: 'HIS',
					commitee_id: 1,
				},
			],
		},
		{
			id: 2,
			class: 9,
			day: 5,
			period: 5,
			teachers: [
				{
					id: 3,
					name: 'Gulami Bete',
					shortname: 'GB',
					email: 'gulami.bete@gmail.com',
				},
			],
			subjects: [
				{
					id: 3,
					name: 'History',
					shortname: 'HIS',
					commitee_id: 1,
				},
			],
		},
		{
			id: 3,
			class: 9,
			day: 1,
			period: 6,
			teachers: [
				{
					id: 2,
					name: 'Francis Muller',
					shortname: 'FM',
					email: 'francis.muller@gmail.com',
				},
				{
					id: 3,
					name: 'Gulami Bete',
					shortname: 'GB',
					email: 'gulami.bete@gmail.com',
				},
			],
			subjects: [
				{
					id: 5,
					name: 'Physics',
					shortname: 'PHY',
					commitee_id: 1,
				},
				{
					id: 6,
					name: 'Spanish',
					shortname: 'SPA',
					commitee_id: 2,
				},
			],
		},
		{
			id: 4,
			class: 9,
			day: 1,
			period: 7,
			teachers: [
				{
					id: 2,
					name: 'Francis Muller',
					shortname: 'FM',
					email: 'francis.muller@gmail.com',
				},
				{
					id: 3,
					name: 'Gulami Bete',
					shortname: 'GB',
					email: 'gulami.bete@gmail.com',
				},
			],
			subjects: [
				{
					id: 6,
					name: 'Spanish',
					shortname: 'SPA',
					commitee_id: 2,
				},
				{
					id: 7,
					name: 'Chemistry',
					shortname: 'CHE',
					commitee_id: 1,
				},
			],
		},
		{
			id: 5,
			class: 9,
			day: 1,
			period: 2,
			teachers: [
				{
					id: 1,
					name: 'John Doe',
					shortname: 'JD',
					email: 'john.doe@gmail.com',
				},
				{
					id: 2,
					name: 'Francis Muller',
					shortname: 'FM',
					email: 'francis.muller@gmail.com',
				},
			],
			subjects: [
				{
					id: 2,
					name: 'English',
					shortname: 'ENG',
					commitee_id: 2,
				},
				{
					id: 1,
					name: 'Math',
					shortname: 'MAT',
					commitee_id: 1,
				},
			],
		},
		{
			id: 6,
			class: 9,
			day: 1,
			period: 3,
			teachers: [
				{
					id: 5,
					name: 'Yannick Gagnon',
					shortname: 'YG',
					email: 'yannic.gagnon@gmail.com',
				},
				{
					id: 6,
					name: 'Zachary Gagnon',
					shortname: 'ZG',
					email: 'zachary.gagnon@gmail.com',
				},
			],
			subjects: [
				{
					id: 6,
					name: 'Spanish',
					shortname: 'SPA',
					commitee_id: 2,
				},
				{
					id: 7,
					name: 'Chemistry',
					shortname: 'CHE',
					commitee_id: 1,
				},
			],
		},
		{
			id: 8,
			class: 9,
			day: 2,
			period: 11,
			teachers: [
				{
					id: 5,
					name: 'Yannick Gagnon',
					shortname: 'YG',
					email: 'yannic.gagnon@gmail.com',
				},
				{
					id: 6,
					name: 'Zachary Gagnon',
					shortname: 'ZG',
					email: 'zachary.gagnon@gmail.com',
				},
			],
			subjects: [
				{
					id: 6,
					name: 'Spanish',
					shortname: 'SPA',
					commitee_id: 2,
				},
				{
					id: 7,
					name: 'Chemistry',
					shortname: 'CHE',
					commitee_id: 1,
				},
			],
		},
		{
			id: 9,
			class: 9,
			day: 2,
			period: 6,
			teachers: [
				{
					id: 5,
					name: 'Yannick Gagnon',
					shortname: 'YG',
					email: 'yannic.gagnon@gmail.com',
				},
				{
					id: 6,
					name: 'Zachary Gagnon',
					shortname: 'ZG',
					email: 'zachary.gagnon@gmail.com',
				},
			],
			subjects: [
				{
					id: 6,
					name: 'Spanish',
					shortname: 'SPA',
					commitee_id: 2,
				},
				{
					id: 7,
					name: 'Chemistry',
					shortname: 'CHE',
					commitee_id: 1,
				},
			],
		},
		{
			id: 10,
			class: 9,
			day: 4,
			period: 2,
			teachers: [
				{
					id: 1,
					name: 'John Doe',
					shortname: 'JD',
					email: 'john.doe@gmail.com',
				},
			],
			subjects: [
				{
					id: 6,
					name: 'Spanish',
					shortname: 'SPA',
					commitee_id: 2,
				},
				{
					id: 1,
					name: 'Math',
					shortname: 'MAT',
					commitee_id: 1,
				},
			],
		},
		{
			id: 12,
			class: 9,
			day: 4,
			period: 11,
			teachers: [
				{
					id: 6,
					name: 'Zachary Gagnon',
					shortname: 'ZG',
					email: 'zachary.gagnon@gmail.com',
				},
				{
					id: 9,
					name: 'Juan Perez',
					shortname: 'JP',
					email: 'juan.perez@gmail.com',
				},
			],
			subjects: [
				{
					id: 5,
					name: 'Physics',
					shortname: 'PHY',
					commitee_id: 1,
				},
			],
		},
	],
	teachers: [
		{
			id: 1,
			name: 'John Doe',
			shortname: 'JD',
			email: 'john.doe@gmail.com',
		},
		{
			id: 2,
			name: 'Francis Muller',
			shortname: 'FM',
			email: 'francis.muller@gmail.com',
		},
		{
			id: 3,
			name: 'Gulami Bete',
			shortname: 'GB',
			email: 'gulami.bete@gmail.com',
		},
		{
			id: 4,
			name: 'Xavier Dufour',
			shortname: 'XD',
			email: 'xavier.dufour@gmail.com',
		},
		{
			id: 5,
			name: 'Yannick Gagnon',
			shortname: 'YG',
			email: 'yannic.gagnon@gmail.com',
		},
		{
			id: 6,
			name: 'Zachary Gagnon',
			shortname: 'ZG',
			email: 'zachary.gagnon@gmail.com',
		},
		{
			id: 7,
			name: 'Francisco Taveras',
			shortname: 'FT',
			email: 'francisco.taveras@gmail.com',
		},
		{
			id: 8,
			name: 'Ivan Nunez',
			shortname: 'IN',
			email: 'ivan.nunez@gmail.com',
		},
		{
			id: 9,
			name: 'Juan Perez',
			shortname: 'JP',
			email: 'juan.perez@gmail.com',
		},
		{
			id: 10,
			name: 'Marshall Miller',
			shortname: 'MM',
			email: 'marshall.miller@gmail.com',
		},
	],
	subjects: [
		{ id: 2, name: 'English', shortname: 'ENG', commitee_id: 2 },
		{ id: 3, name: 'History', shortname: 'HIS', commitee_id: 1 },
		{ id: 4, name: 'Geography', shortname: 'GEO', commitee_id: 1 },
		{ id: 5, name: 'Physics', shortname: 'PHY', commitee_id: 1 },
		{ id: 6, name: 'Spanish', shortname: 'SPA', commitee_id: 2 },
		{ id: 7, name: 'Chemistry', shortname: 'CHE', commitee_id: 1 },
		{ id: 8, name: 'Italian', shortname: 'ITA', commitee_id: 2 },
		{ id: 1, name: 'Math', shortname: 'MAT', commitee_id: 1 },
	],
	classes: [
		{ id: 9, name: '1.A', teacher_id: 1 },
		{ id: 10, name: '1.B', teacher_id: 2 },
		{ id: 11, name: '1.C', teacher_id: 3 },
		{ id: 12, name: '1.D', teacher_id: 4 },
		{ id: 13, name: '2.A', teacher_id: 5 },
		{ id: 14, name: '2.B', teacher_id: 6 },
		{ id: 15, name: '2.C', teacher_id: 7 },
		{ id: 16, name: '2.D', teacher_id: 8 },
	],

	addLesson: (class_id, position, subject, teacher) =>
		set((state) => ({
			rawTableData: [
				...state.rawTableData,
				{
					class: class_id,
					day: getDayFromPosition(position),
					period: getPeriodFromPosition(position),
					teachers: teacher,
					subjects: subject,
				},
			],
		})),
	updateLesson: (class_id, position, subject, teacher) =>
		set((state) => ({
			rawTableData: [
				...state.rawTableData.filter(
					(lesson) =>
						`${lesson.class}${lesson.day}${lesson.period}` !==
						`${class_id}${getDayFromPosition(
							position
						)}${getPeriodFromPosition(position)}`
				),
				{
					class: class_id,
					day: getDayFromPosition(position),
					period: getPeriodFromPosition(position),
					teachers: teacher,
					subjects: subject,
				},
			],
		})),
	deleteLesson: (class_id, position) =>
		set((state) => ({
			rawTableData: [
				...state.rawTableData.filter(
					(lesson) =>
						`${lesson.class}${lesson.day}${lesson.period}` !==
						`${class_id}${getDayFromPosition(
							position
						)}${getPeriodFromPosition(position)}`
				),
			],
		})),
	copyLessons: (from, to) => {
		const srcLessons = get().rawTableData.filter(
			(lesson) => lesson.class === from
		)
		const destLessons = srcLessons.map((lesson) => ({
			...lesson,
			class: to,
		}))
		set((state) => ({
			rawTableData: [...state.rawTableData, ...destLessons],
		}))
	},

	selectedClass: 9,
	setSelectedClass: (class_id) =>
		set(() => ({ selectedClass: class_id })),
}))

export default useTimetableStore
