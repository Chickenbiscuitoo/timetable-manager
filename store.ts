import {
	Class,
	Subject,
	Teacher,
	Committee,
	Binding,
} from '@prisma/client'

import {
	getDayFromPosition,
	getPeriodFromPosition,
} from './utils/getPosition'

import create from 'zustand'

import { v4 as uuidv4 } from 'uuid'

interface TimetableState {
	schoolYear: string
	bindings: {
		id: number | string
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

	deleteTeacherFromBinding: (
		bindingId: number,
		teacherId: number
	) => void

	updateBindingLessonCount: (
		bindingId: number,
		teacherId: number,
		operation: string
	) => void
	copyBindings: (srcId: number, destId: number) => void

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
	classes: {
		id: number
		name: string
		teacher_id: number
		grade: number
	}[]

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
	removeTeacher: (id: number) => void
	updateTeacher: (
		id: number,
		name: string,
		shortname: string,
		email: string
	) => void

	addClass: (name: string, teacher_id: number) => void
	removeClass: (id: number) => void
	updateClass: (id: number, name: string, teacher_id: number) => void

	addSubject: (
		name: string,
		shortname: string,
		commiteeId: number
	) => void
	updateSubject: (
		id: number,
		name: string,
		shortname: string,
		commiteeId: number
	) => void
	removeSubject: (id: number) => void

	selectedClass: number
	setSelectedClass: (class_id: number) => void

	selectedGrade: number
	setSelectedGrade: (grade: number) => void
}

const useTimetableStore = create<TimetableState>((set, get) => ({
	schoolYear: '2020/2021',
	bindings: [
		{
			id: 1,
			teachers: [
				{
					id: 3,
					name: 'Gulami Bete',
					shortname: 'GB',
					email: 'gulami.bete@gmail.com',
					lessons: 1,
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
				commiteeId: 1,
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
					lessons: 1,
				},
			],
			subject: {
				id: 5,
				name: 'Physics',
				shortname: 'PHY',
				commiteeId: 1,
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
					lessons: 7,
				},
			],
			subject: {
				id: 5,
				name: 'Physics',
				shortname: 'PHY',
				commiteeId: 1,
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
				commiteeId: 1,
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
				commiteeId: 1,
			},
			cl: { id: 2, name: '1.B', teacher_id: 2, grade: 1 },
		},
		{
			id: 6,
			teachers: [
				{
					id: 3,
					name: 'Gulami Bete',
					shortname: 'GB',
					email: 'gulami.bete@gmail.com',
					lessons: 8,
				},
			],
			subject: {
				id: 1,
				name: 'Math',
				shortname: 'MAT',
				commiteeId: 1,
			},
			cl: { id: 12, name: '1.G', teacher_id: 12, grade: 1 },
		},
		{
			id: 7,
			teachers: [
				{
					id: 3,
					name: 'Gulami Bete',
					shortname: 'GB',
					email: 'gulami.bete@gmail.com',
					lessons: 7,
				},
			],
			subject: {
				id: 2,
				name: 'English',
				shortname: 'ENG',
				commiteeId: 2,
			},
			cl: { id: 12, name: '1.G', teacher_id: 12, grade: 1 },
		},
		{
			id: 8,
			teachers: [
				{
					id: 1,
					name: 'John Doe',
					shortname: 'JD',
					email: 'john.doe@gmail.com',
					lessons: 9,
				},
			],
			subject: {
				id: 2,
				name: 'English',
				shortname: 'ENG',
				commiteeId: 2,
			},
			cl: { id: 1, name: '1.A', teacher_id: 1, grade: 1 },
		},
		{
			id: 9,
			teachers: [
				{
					id: 10,
					name: 'Marshall Miller',
					shortname: 'MM',
					email: 'marshall.miller@gmail.com',
					lessons: 7,
				},
			],
			subject: {
				id: 8,
				name: 'Italian',
				shortname: 'ITA',
				commiteeId: 2,
			},
			cl: { id: 5, name: '1.E', teacher_id: 10, grade: 1 },
		},
		{
			id: 10,
			teachers: [
				{
					id: 4,
					name: 'Xavier Dufour',
					shortname: 'XD',
					email: 'xavier.dufour@gmail.com',
					lessons: 2,
				},
			],
			subject: {
				id: 6,
				name: 'Spanish',
				shortname: 'SPA',
				commiteeId: 2,
			},
			cl: { id: 4, name: '1.D', teacher_id: 4, grade: 1 },
		},
	],

	addBinding: (teachers, subject, cl) => {
		set((state) => ({
			bindings: [
				...state.bindings,
				{
					id: uuidv4(),
					teachers,
					subject,
					cl,
				},
			],
		}))
	},

	deleteBinding: (id) =>
		set((state) => ({
			bindings: [
				...state.bindings.filter((binding) => binding.id !== id),
			],
		})),

	deleteTeacherFromBinding: (bindingId, teacherId) => {
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

		const newTeachersArr = oldBinding.teachers.filter(
			(tch) => tch.id !== teacherId
		)

		if (newTeachersArr.length === 0) {
			set((state) => ({
				bindings: [
					...state.bindings.filter(
						(binding) => binding.id !== bindingId
					),
				],
			}))
		} else {
			set((state) => ({
				bindings: [
					...state.bindings.filter(
						(binding) => binding.id !== bindingId
					),
					{
						...oldBinding,
						teachers: newTeachersArr,
					},
				],
			}))
		}
	},

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

		if (oldTeacher.lessons === 1 && operation === 'decrement') {
			return
		} else if (
			operation !== 'decrement' &&
			operation !== 'increment'
		) {
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
							lessons:
								operation === 'increment'
									? oldTeacher.lessons + 1
									: oldTeacher.lessons - 1,
						},
					],
					subject: oldBinding.subject,
					cl: oldBinding.cl,
				},
			],
		}))
	},
	copyBindings: (srcId, destId) => {
		const srcBindings = get().bindings.filter(
			(binding) => binding.cl.id === srcId
		)
		const destClass = get().classes.find((cl) => cl.id === destId)

		if (srcBindings.length === 0) {
			console.log('No bindings found')
			return
		} else if (!destClass) {
			console.log('Class not found')
			return
		}

		set((state) => ({
			bindings: [
				...state.bindings,
				...srcBindings.map((binding) => ({
					id: uuidv4(),
					teachers: binding.teachers,
					subject: binding.subject,
					cl: {
						id: destId,
						name: destClass.name,
						teacher_id: destClass.teacher_id,
						grade: destClass.grade,
					},
				})),
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
					commiteeId: 1,
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
					commiteeId: 1,
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
					commiteeId: 1,
				},
				{
					id: 6,
					name: 'Spanish',
					shortname: 'SPA',
					commiteeId: 2,
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
					commiteeId: 2,
				},
				{
					id: 7,
					name: 'Chemistry',
					shortname: 'CHE',
					commiteeId: 1,
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
					commiteeId: 2,
				},
				{
					id: 1,
					name: 'Math',
					shortname: 'MAT',
					commiteeId: 1,
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
					commiteeId: 2,
				},
				{
					id: 7,
					name: 'Chemistry',
					shortname: 'CHE',
					commiteeId: 1,
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
					commiteeId: 2,
				},
				{
					id: 7,
					name: 'Chemistry',
					shortname: 'CHE',
					commiteeId: 1,
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
					commiteeId: 2,
				},
				{
					id: 7,
					name: 'Chemistry',
					shortname: 'CHE',
					commiteeId: 1,
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
					commiteeId: 2,
				},
				{
					id: 1,
					name: 'Math',
					shortname: 'MAT',
					commiteeId: 1,
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
					commiteeId: 1,
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
					commiteeId: 1,
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
					commiteeId: 1,
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
		{ id: 2, name: 'English', shortname: 'ENG', commiteeId: 2 },
		{ id: 3, name: 'History', shortname: 'HIS', commiteeId: 1 },
		{ id: 4, name: 'Geography', shortname: 'GEO', commiteeId: 1 },
		{ id: 5, name: 'Physics', shortname: 'PHY', commiteeId: 1 },
		{ id: 6, name: 'Spanish', shortname: 'SPA', commiteeId: 2 },
		{ id: 7, name: 'Chemistry', shortname: 'CHE', commiteeId: 1 },
		{ id: 8, name: 'Italian', shortname: 'ITA', commiteeId: 2 },
		{ id: 1, name: 'Math', shortname: 'MAT', commiteeId: 1 },
	],
	classes: [
		{ id: 10, name: '2.C', teacher_id: 7, grade: 2 },
		{ id: 1, name: '1.A', teacher_id: 1, grade: 1 },
		{ id: 2, name: '1.B', teacher_id: 2, grade: 1 },
		{ id: 3, name: '1.C', teacher_id: 3, grade: 1 },
		{ id: 4, name: '1.D', teacher_id: 4, grade: 1 },
		{ id: 5, name: '1.E', teacher_id: 10, grade: 1 },
		{ id: 6, name: '1.F', teacher_id: 11, grade: 1 },
		{ id: 12, name: '1.G', teacher_id: 12, grade: 1 },
		{ id: 8, name: '2.A', teacher_id: 5, grade: 2 },
		{ id: 9, name: '2.B', teacher_id: 6, grade: 2 },
		{ id: 11, name: '2.D', teacher_id: 8, grade: 2 },
		{ id: 13, name: '2.F', teacher_id: 13, grade: 2 },
		{ id: 14, name: '3.A', teacher_id: 14, grade: 3 },
		{ id: 15, name: '3.B', teacher_id: 15, grade: 3 },
		{ id: 16, name: '3.C', teacher_id: 16, grade: 3 },
		{ id: 17, name: '3.D', teacher_id: 17, grade: 3 },
		{ id: 18, name: '3.E', teacher_id: 18, grade: 3 },
		{ id: 19, name: '4.A', teacher_id: 19, grade: 4 },
		{ id: 20, name: '4.B', teacher_id: 20, grade: 4 },
		{ id: 21, name: '4.C', teacher_id: 21, grade: 4 },
		{ id: 22, name: '4.D', teacher_id: 22, grade: 4 },
		{ id: 24, name: '4.E', teacher_id: 23, grade: 4 },
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
		const id = Date.now() + Math.random()
		set((state) => ({
			teachers: [...state.teachers, { id, name, shortname, email }],
		}))
	},

	removeTeacher: (id) => {
		set((state) => ({
			teachers: state.teachers.filter(
				(teacher) => teacher.id !== id
			),
		}))
	},

	updateTeacher: (id, name, shortname, email) => {
		set((state) => ({
			teachers: [
				...state.teachers.filter((teacher) => teacher.id !== id),
				{ id, name, shortname, email },
			],
		}))
	},

	addClass: (name, teacher_id) => {
		const id = Date.now() + Math.random()
		const grade = parseInt(name.split('.')[0])

		set((state) => ({
			classes: [...state.classes, { id, name, teacher_id, grade }],
		}))
	},

	removeClass: (id) => {
		set((state) => ({
			classes: state.classes.filter((class_) => class_.id !== id),
		}))
	},

	updateClass: (id, name, teacher_id) => {
		const grade = parseInt(name.split('.')[0])
		set((state) => ({
			classes: [
				...state.classes.filter((class_) => class_.id !== id),
				{ id, name, teacher_id, grade },
			],
		}))
	},

	addSubject: (name, shortname, commiteeId) => {
		const id = Date.now() + Math.random()
		set((state) => ({
			subjects: [
				...state.subjects,
				{ id, name, shortname, commiteeId },
			],
		}))
	},

	updateSubject: (id, name, shortname, commiteeId) => {
		set((state) => ({
			subjects: [
				...state.subjects.filter((subject) => subject.id !== id),
				{ id, name, shortname, commiteeId },
			],
		}))
	},

	removeSubject: (id) => {
		set((state) => ({
			subjects: state.subjects.filter(
				(subject) => subject.id !== id
			),
		}))
	},

	selectedClass: 1,
	setSelectedClass: (class_id) =>
		set(() => ({ selectedClass: class_id })),

	selectedGrade: 1,
	setSelectedGrade: (grade) => set(() => ({ selectedGrade: grade })),
}))

export default useTimetableStore
