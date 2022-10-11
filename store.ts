import { Class, Subject, Teacher } from '@prisma/client'
import {
	getDayFromPosition,
	getPeriodFromPosition,
} from './utils/getPosition'

import create from 'zustand'
import { totalmem } from 'os'

interface TimetableState {
	bindings: {
		id?: number
		teachers: {
			id: number
			name: string
			shortname: string
			email: string
			lessons: number
		}[]
		subject: Subject
		cl: {
			id: number
			name: string
			teacher_id: number
			grade: number
		}
	}[]

	addBinding: (
		teachers: {
			id: number
			name: string
			shortname: string
			email: string
			lessons: number
		}[],
		subject: Subject,
		cl: {
			id: number
			name: string
			teacher_id: number
			grade: number
		}
	) => void
	deleteBinding: (id: number) => void
	updateBinding: (
		id: number,
		teachers: {
			id: number
			name: string
			shortname: string
			email: string
			lessons: number
		}[],
		subject: Subject,
		cl: {
			id: number
			name: string
			teacher_id: number
			grade: number
		}
	) => void
	updateBindingLessonCount: (
		bindingId: number,
		teacherId: number,
		operation: string
	) => void

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

	addTeacher: (name: string, shortname: string, email: string) => void

	selectedClass: number
	setSelectedClass: (class_id: number) => void

	selectedGrade: number
	setSelectedGrade: (grade: number) => void
}

const useTimetableStore = create<TimetableState>((set, get) => ({
	bindings: [
		{
			id: 1,
			teachers: [
				{
					id: 3,
					name: 'Gulami Bete',
					shortname: 'GB',
					email: 'gulami.bete@gmail.com',
					lessons: 2,
				},
				{
					id: 2,
					name: 'Francis Muller',
					shortname: 'FM',
					email: 'francis.muller@gmail.com',
					lessons: 3,
				},
			],
			subject: {
				id: 5,
				name: 'Physics',
				shortname: 'PHY',
				commitee_id: 1,
			},
			cl: { id: 1, name: '1.A', teacher_id: 1, grade: 1 },
		},
		{
			id: 2,
			teachers: [
				{
					id: 3,
					name: 'Gulami Bete',
					shortname: 'GB',
					email: 'gulami.bete@gmail.com',
					lessons: 3,
				},
			],
			subject: {
				id: 5,
				name: 'Physics',
				shortname: 'PHY',
				commitee_id: 1,
			},
			cl: { id: 2, name: '1.B', teacher_id: 2, grade: 1 },
		},
		{
			id: 3,
			teachers: [
				{
					id: 3,
					name: 'Gulami Bete',
					shortname: 'GB',
					email: 'gulami.bete@gmail.com',
					lessons: 5,
				},
			],
			subject: {
				id: 5,
				name: 'Physics',
				shortname: 'PHY',
				commitee_id: 1,
			},
			cl: { id: 3, name: '1.C', teacher_id: 3, grade: 1 },
		},
		{
			id: 4,
			teachers: [
				{
					id: 2,
					name: 'Francis Muller',
					shortname: 'FM',
					email: 'francis.muller@gmail.com',
					lessons: 6,
				},
			],
			subject: {
				id: 3,
				name: 'History',
				shortname: 'HIS',
				commitee_id: 1,
			},
			cl: { id: 1, name: '1.A', teacher_id: 1, grade: 1 },
		},
		{
			id: 5,
			teachers: [
				{
					id: 2,
					name: 'Francis Muller',
					shortname: 'FM',
					email: 'francis.muller@gmail.com',
					lessons: 2,
				},
			],
			subject: {
				id: 3,
				name: 'History',
				shortname: 'HIS',
				commitee_id: 1,
			},
			cl: { id: 2, name: '1.B', teacher_id: 2, grade: 1 },
		},
	],

	addBinding: (teachers, subject, cl) =>
		set((state) => ({
			bindings: [
				...state.bindings,
				{
					id: state.bindings.length + 1,
					teachers,
					subject,
					cl,
				},
			],
		})),

	deleteBinding: (id) =>
		set((state) => ({
			bindings: [
				...state.bindings.filter((binding) => binding.id !== id),
			],
		})),

	updateBinding: (id, teachers, subject, cl) =>
		set((state) => ({
			bindings: [
				...state.bindings.filter((binding) => binding.id !== id),
				{
					id,
					teachers,
					subject,
					cl,
				},
			],
		})),

	updateBindingLessonCount: (bindingId, teacherId, operation) => {
		const oldBinding = get().bindings.find(
			(binding) => binding.id === bindingId
		)
		if (!oldBinding) {
			console.log('Binding not found')
			return
		}

		const oldTeacher = oldBinding.teachers.find(
			(teacher) => teacher.id === teacherId
		)
		if (!oldTeacher) {
			console.log('Teacher not found')
			return
		}

		if (oldTeacher.lessons === 0 && operation === 'decrement') {
			return
		} else if (operation === 'increment') {
			oldTeacher.lessons++
		} else if (operation === 'decrement') {
			oldTeacher.lessons--
		} else {
			console.log('Invalid operation')
			return
		}

		set((state) => ({
			bindings: [
				...state.bindings.filter(
					(binding) => binding.id !== bindingId
				),
				{
					id: bindingId,
					teachers: [
						...oldBinding.teachers.filter(
							(teacher) => teacher.id !== teacherId
						),
						{
							...oldTeacher,
						},
					],
					subject: oldBinding.subject,
					cl: oldBinding.cl,
				},
			],
		}))
	},

	rawTableData: [
		{
			id: 2,
			class: 1,
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
			class: 1,
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
			class: 1,
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
			class: 1,
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
			class: 1,
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
			class: 1,
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
			class: 1,
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
			class: 1,
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
			class: 1,
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
			class: 1,
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
		{
			id: 13,
			class: 2,
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
		{
			id: 14,
			class: 6,
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
		{ id: 1, name: '1.A', teacher_id: 1, grade: 1 },
		{ id: 2, name: '1.B', teacher_id: 2, grade: 1 },
		{ id: 3, name: '1.C', teacher_id: 3, grade: 1 },
		{ id: 4, name: '1.D', teacher_id: 4, grade: 1 },
		{ id: 5, name: '1.E', teacher_id: 10, grade: 1 },
		{ id: 10, name: '1.F', teacher_id: 11, grade: 1 },
		{ id: 11, name: '1.G', teacher_id: 12, grade: 1 },
		{ id: 6, name: '2.A', teacher_id: 5, grade: 2 },
		{ id: 7, name: '2.B', teacher_id: 6, grade: 2 },
		{ id: 8, name: '2.C', teacher_id: 7, grade: 2 },
		{ id: 9, name: '2.D', teacher_id: 8, grade: 2 },
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

	addTeacher: (name, shortname, email) => {
		const id = get().teachers.length + 1
		set((state) => ({
			teachers: [...state.teachers, { id, name, shortname, email }],
		}))
	},

	selectedClass: 1,
	setSelectedClass: (class_id) =>
		set(() => ({ selectedClass: class_id })),

	selectedGrade: 1,
	setSelectedGrade: (grade) => set(() => ({ selectedGrade: grade })),
}))

export default useTimetableStore
