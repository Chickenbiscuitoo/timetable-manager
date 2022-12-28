import {
	Class,
	Subject,
	Teacher,
	Committee,
	Binding,
} from '@prisma/client'

import axios from 'axios'

import {
	getDayFromPosition,
	getPeriodFromPosition,
} from './utils/getPosition'

import create from 'zustand'

import { v4 as uuidv4 } from 'uuid'

interface TimetableStore {
	schoolYear: string

	organization: {
		id: number
		name: string
		members: number
	} | null
	fetchOrganization: () => void

	teachers:
		| {
				id: number
				name: string
				shortname: string
				email: string
		  }[]
		| []
	fetchTeachers: () => void

	subjects:
		| {
				id: number
				name: string
				shortname: string
				commiteeId: number
		  }[]
		| []
	fetchSubjects: () => void

	classes:
		| {
				id: number
				name: string
				grade: number
				teacherId: number
		  }[]
		| []
	fetchClasses: () => void

	bindings:
		| {
				id: number
				teachers: {
					id: number
					name: string
					shortname: string
					email: string
					lessons: number
				}[]
				subject: {
					id: number
					name: string
					shortname: string
					commiteeId: number
				}
				cl: {
					id: number
					name: string
					grade: number
					teacherId: number
				}
		  }[]
		| []
	fetchBindings: () => void

	addBinding: (
		teacherId: number,
		subjectId: number,
		classId: number
	) => void
	deleteBinding: (id: number) => void
	deleteTeacherFromBinding: (
		bindingId: number,
		teacherId: number
	) => void
	addTeacherToBinding: (bindingId: number, teacherId: number) => void
	updateBindingLessonCount: (
		bindingId: number,
		teacherId: number,
		operation: string
	) => void

	addTeacher: (name: string, shortname: string, email: string) => void
	removeTeacher: (id: number) => void
	updateTeacher: (
		id: number,
		name: string,
		shortname: string,
		email: string
	) => void

	addClass: (name: string, grade: number, teacherId: number) => void
	removeClass: (id: number) => void
	updateClass: (
		id: number,
		name: string,
		grade: number,
		teacherId: number
	) => void

	addSubject: (
		name: string,
		shortname: string,
		commiteeId: number
	) => void
	removeSubject: (id: number) => void
	updateSubject: (
		id: number,
		name: string,
		shortname: string,
		commiteeId: number
	) => void

	selectedClass: number
	setSelectedClass: (classId: number) => void

	selectedGrade: number
	setSelectedGrade: (grade: number) => void
}

// TODO: Copy bindings func

const useTimetableStore = create<TimetableStore>((set, get) => ({
	schoolYear: '2020/2021',

	organization: null,
	fetchOrganization: async () => {
		const response = await axios.get(
			'http://localhost:3000/api/organizations'
		)

		if (response.data.message === 'No organization') {
			return
		}

		set({
			organization: response.data,
		})
	},

	teachers: [],
	fetchTeachers: async () => {
		const response = await axios.get(
			'http://localhost:3000/api/teachers'
		)

		set({
			teachers: response.data,
		})
	},

	subjects: [],
	fetchSubjects: async () => {
		const response = await axios.get(
			'http://localhost:3000/api/subjects'
		)

		set({
			subjects: response.data,
		})
	},

	classes: [],
	fetchClasses: async () => {
		const response = await axios.get(
			'http://localhost:3000/api/classes'
		)

		set({
			classes: response.data,
		})
	},

	bindings: [],
	fetchBindings: async () => {
		const response = await axios.get(
			'http://localhost:3000/api/bindings'
		)

		set({
			bindings: response.data,
		})
	},

	addBinding: async (teacherId, subjectId, classId) => {
		const response = await axios.put(
			'http://localhost:3000/api/bindings',
			{
				teacherId,
				subjectId,
				classId,
			}
		)

		get().fetchBindings()
	},

	deleteBinding: async (id) => {
		const response = await axios.delete(
			'http://localhost:3000/api/bindings',
			{
				data: {
					id,
				},
			}
		)

		get().fetchBindings()
	},

	deleteTeacherFromBinding: async (bindingId, teacherId) => {
		const response = await axios.delete(
			'http://localhost:3000/api/bindings/teachers',
			{
				data: {
					bindingId,
					teacherId,
				},
			}
		)

		get().fetchBindings()
	},

	addTeacherToBinding: async (bindingId, teacherId) => {
		const response = await axios.patch(
			'http://localhost:3000/api/bindings/teachers',
			{
				bindingId,
				teacherId,
			}
		)

		get().fetchBindings()
	},

	updateBindingLessonCount: async (bindingId, teacherId, operation) => {
		if (operation !== 'increment' && operation !== 'decrement') {
			console.log('Operation not found')
			return
		}

		const response = await axios.patch(
			'http://localhost:3000/api/bindings/lessonsCount',
			{
				bindingId,
				teacherId,
				operation,
			}
		)

		get().fetchBindings()
	},

	// rawTableData: [],
	// addLesson: (class_id, position, subject, teacher) =>
	// 	set((state) => ({
	// 		rawTableData: [
	// 			...state.rawTableData,
	// 			{
	// 				class: class_id,
	// 				day: getDayFromPosition(position),
	// 				period: getPeriodFromPosition(position),
	// 				teachers: teacher,
	// 				subjects: subject,
	// 			},
	// 		],
	// 	})),
	// updateLesson: (class_id, position, subject, teacher) =>
	// 	set((state) => ({
	// 		rawTableData: [
	// 			...state.rawTableData.filter(
	// 				(lesson) =>
	// 					`${lesson.class}${lesson.day}${lesson.period}` !==
	// 					`${class_id}${getDayFromPosition(
	// 						position
	// 					)}${getPeriodFromPosition(position)}`
	// 			),
	// 			{
	// 				class: class_id,
	// 				day: getDayFromPosition(position),
	// 				period: getPeriodFromPosition(position),
	// 				teachers: teacher,
	// 				subjects: subject,
	// 			},
	// 		],
	// 	})),
	// deleteLesson: (class_id, position) =>
	// 	set((state) => ({
	// 		rawTableData: [
	// 			...state.rawTableData.filter(
	// 				(lesson) =>
	// 					`${lesson.class}${lesson.day}${lesson.period}` !==
	// 					`${class_id}${getDayFromPosition(
	// 						position
	// 					)}${getPeriodFromPosition(position)}`
	// 			),
	// 		],
	// 	})),
	// copyLessons: (from, to) => {
	// 	const srcLessons = get().rawTableData.filter(
	// 		(lesson) => lesson.class === from
	// 	)
	// 	const destLessons = srcLessons.map((lesson) => ({
	// 		...lesson,
	// 		class: to,
	// 	}))
	// 	set((state) => ({
	// 		rawTableData: [...state.rawTableData, ...destLessons],
	// 	}))
	// },

	addTeacher: async (name, shortname, email) => {
		const response = await axios.put(
			'http://localhost:3000/api/teachers',
			{
				name,
				shortname,
				email,
			}
		)

		get().fetchTeachers()
	},

	removeTeacher: async (id) => {
		const response = await axios.delete(
			'http://localhost:3000/api/teachers',
			{
				data: {
					id,
				},
			}
		)

		get().fetchTeachers()
	},

	updateTeacher: async (id, name, shortname, email) => {
		const response = await axios.patch(
			'http://localhost:3000/api/teachers',
			{
				id,
				name,
				shortname,
				email,
			}
		)

		get().fetchTeachers()
	},

	addClass: async (name, grade, teacherId) => {
		const response = await axios.put(
			'http://localhost:3000/api/classes',
			{
				name,
				grade,
				teacherId,
			}
		)

		get().fetchClasses()
	},

	removeClass: async (id) => {
		const response = await axios.delete(
			'http://localhost:3000/api/classes',
			{
				data: {
					id,
				},
			}
		)

		get().fetchClasses()
	},

	updateClass: async (id, name, grade, teacherId) => {
		const response = await axios.patch(
			'http://localhost:3000/api/classes',
			{
				id,
				name,
				grade,
				teacherId,
			}
		)

		get().fetchClasses()
	},

	addSubject: async (name, shortname, commiteeId) => {
		const response = await axios.put(
			'http://localhost:3000/api/subjects',
			{
				name,
				shortname,
				commiteeId,
			}
		)

		get().fetchSubjects()
	},

	updateSubject: async (id, name, shortname, commiteeId) => {
		const response = await axios.patch(
			'http://localhost:3000/api/subjects',
			{
				id,
				name,
				shortname,
				commiteeId,
			}
		)

		get().fetchSubjects()
	},

	removeSubject: async (id) => {
		const response = await axios.delete(
			'http://localhost:3000/api/subjects',
			{
				data: {
					id,
				},
			}
		)

		get().fetchSubjects()
	},

	selectedClass: 1,
	setSelectedClass: (classId) => set(() => ({ selectedClass: classId })),

	selectedGrade: 1,
	setSelectedGrade: (grade) => set(() => ({ selectedGrade: grade })),
}))

useTimetableStore.getState().fetchOrganization()
useTimetableStore.getState().fetchTeachers()
useTimetableStore.getState().fetchSubjects()
useTimetableStore.getState().fetchClasses()
useTimetableStore.getState().fetchBindings()

export default useTimetableStore
