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
		const teacherData = get().teachers.find(
			(teacher) => teacher.id === teacherId
		)

		const subjectData = get().subjects.find(
			(subject) => subject.id === subjectId
		)

		const classData = get().classes.find((cl) => cl.id === classId)

		if (!teacherData || !subjectData || !classData) {
			console.log('Error: No data found')
			return
		}

		const newBinding = {
			id: Math.floor(Math.random() * Date.now()),
			teachers: [
				{
					...teacherData,
					lessons: 1,
				},
			],
			subject: subjectData,
			cl: classData,
		}

		set((state) => ({
			bindings: [...state.bindings, newBinding],
		}))

		const response = await axios.put(
			'http://localhost:3000/api/bindings',
			{
				teacherId,
				subjectId,
				classId,
			}
		)
	},

	deleteBinding: async (id) => {
		set((state) => ({
			bindings: [
				...state.bindings.filter((binding) => binding.id !== id),
			],
		}))

		const response = await axios.delete(
			'http://localhost:3000/api/bindings',
			{
				data: {
					id,
				},
			}
		)
	},

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

		const response = axios.delete(
			'http://localhost:3000/api/bindings/teachers',
			{
				data: {
					bindingId,
					teacherId,
				},
			}
		)
	},

	addTeacherToBinding: (bindingId, teacherId) => {
		const teacherData = get().teachers.find(
			(teacher) => teacher.id === teacherId
		)

		const oldBinding = get().bindings.find(
			(binding) => binding.id === bindingId
		)

		if (!teacherData || !oldBinding) {
			console.log('Error: No data found')
			return
		}

		set((state) => ({
			bindings: [
				...state.bindings.filter(
					(binding) => binding.id !== bindingId
				),
				{
					id: oldBinding.id,
					teachers: [
						...oldBinding.teachers,
						{
							...teacherData,
							lessons: 1,
						},
					],
					subject: oldBinding.subject,
					cl: oldBinding.cl,
				},
			],
		}))

		const response = axios.patch(
			'http://localhost:3000/api/bindings/teachers',
			{
				bindingId,
				teacherId,
			}
		)
	},

	updateBindingLessonCount: (bindingId, teacherId, operation) => {
		if (operation !== 'increment' && operation !== 'decrement') {
			console.log('Operation not found')
			return
		}

		const response = axios.patch(
			'http://localhost:3000/api/bindings/lessonsCount',
			{
				bindingId,
				teacherId,
				operation,
			}
		)

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

	addTeacher: (name, shortname, email) => {
		const response = axios.put('http://localhost:3000/api/teachers', {
			name,
			shortname,
			email,
		})

		const id = Date.now() + Math.random()
		set((state) => ({
			teachers: [...state.teachers, { id, name, shortname, email }],
		}))
	},

	removeTeacher: (id) => {
		const response = axios.delete(
			'http://localhost:3000/api/teachers',
			{
				data: {
					id,
				},
			}
		)

		set((state) => ({
			teachers: state.teachers.filter(
				(teacher) => teacher.id !== id
			),
		}))
	},

	updateTeacher: (id, name, shortname, email) => {
		const response = axios.patch(
			'http://localhost:3000/api/teachers',
			{
				id,
				name,
				shortname,
				email,
			}
		)

		set((state) => ({
			teachers: [
				...state.teachers.filter((teacher) => teacher.id !== id),
				{ id, name, shortname, email },
			],
		}))
	},

	addClass: (name, grade, teacherId) => {
		const response = axios.put('http://localhost:3000/api/classes', {
			name,
			grade,
			teacherId,
		})
	},

	removeClass: (id) => {
		const response = axios.delete(
			'http://localhost:3000/api/classes',
			{
				data: {
					id,
				},
			}
		)
	},

	updateClass: (id, name, grade, teacherId) => {
		const response = axios.patch('http://localhost:3000/api/classes', {
			id,
			name,
			grade,
			teacherId,
		})
	},

	addSubject: (name, shortname, commiteeId) => {
		const response = axios.put('http://localhost:3000/api/subjects', {
			data: {
				name,
				shortname,
				commiteeId,
			},
		})
	},

	updateSubject: (id, name, shortname, commiteeId) => {
		const response = axios.patch(
			'http://localhost:3000/api/subjects',
			{
				data: {
					id,
					name,
					shortname,
					commiteeId,
				},
			}
		)
	},

	removeSubject: (id) => {
		const response = axios.delete(
			'http://localhost:3000/api/subjects',
			{
				data: {
					id,
				},
			}
		)
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
