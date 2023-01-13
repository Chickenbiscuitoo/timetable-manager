import axios, { AxiosError } from 'axios'

import create from 'zustand'

const API_URL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:3000/api'
		: 'https://timetable-manager.vercel.app/api'

interface TimetableStore {
	mode: string
	setMode: (mode: string) => void

	schoolYear: string
	schoolYearOptions: string[]
	setSchoolYear: (schoolYear: string) => void

	organization: {
		id: string
		name: string
		members: number
	} | null
	fetchOrganization: () => void

	createOrganization: (name: string) => void
	leaveOrganization: () => void
	inviteMemberToOrganization: (
		recipientEmail: string,
		orgId: string
	) => void

	teachers:
		| {
				id: number
				name: string
				shortname: string
				email: string
		  }[]
		| []
	fetchTeachers: (showLoading?: boolean) => void

	subjects:
		| {
				id: number
				name: string
				shortname: string
				commiteeId: number
		  }[]
		| []
	fetchSubjects: (showLoading?: boolean) => void

	classes:
		| {
				id: number
				name: string
				grade: number
				teacher: {
					id: number
					name: string
					shortname: string
					email: string
				}
		  }[]
		| []
	fetchClasses: (showLoading?: boolean) => void

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
					teacher: {
						id: number
						name: string
						shortname: string
						email: string
					}
				}
		  }[]
		| []
	fetchBindings: (showLoading?: boolean) => void

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

	copyBindings: (srcClassId: number, destClassId: number) => void
	copyLessons: (srcClassId: number, destClassId: number) => void

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

	rawTableData:
		| {
				id: number
				classId: number
				day: number
				period: number
				subjects: {
					id: number
					name: string
					shortname: string
					commiteeId: number
				}[]
				teachers:
					| {
							id: number
							name: string
							shortname: string
							email: string
					  }[]
					| []
		  }[]
		| []

	fetchLessons: (showLoading?: boolean) => void

	addLesson: (
		classId: number,
		subjectId: number,
		day: number,
		period: number
	) => void

	removeLesson: (id: number) => void

	updateLesson: (
		id: number,
		teacherId?: number,
		subjectId?: number
	) => void

	sendBindings: () => void

	selectedClass: number
	setSelectedClass: (classId: number) => void

	selectedGrade: number
	setSelectedGrade: (grade: number) => void

	errorMessage: string
	resetErrorMessage: () => void

	alertMessage: {
		message: string
		status: 'confirmed' | 'denied' | undefined
	}
	setAlertMessage: (
		message: string,
		status: 'confirmed' | 'denied' | undefined
	) => void
	resetAlertMessage: () => void

	teachersLoading: boolean
	subjectsLoading: boolean
	classesLoading: boolean
	bindingsLoading: boolean
	lessonsLoading: boolean
}

// TODO: Copy bindings func
// TODO: Copy lessons func

const useTimetableStore = create<TimetableStore>((set, get) => ({
	mode: 'personal',
	setMode: (mode: string) => {
		const organization = get().organization

		if (mode === 'organization' && !organization) {
			set({
				errorMessage: 'You are not a member of any organization.',
			})
			return
		}

		set({
			mode,
		})

		get().fetchTeachers(true)
		get().fetchSubjects(true)
		get().fetchClasses(true)
		get().fetchBindings(true)
		get().fetchLessons(true)
		get().fetchOrganization()
	},

	schoolYear: '2020/2021',
	schoolYearOptions: [
		'2020/2021',
		'2021/2022',
		'2022/2023',
		'2023/2024',
		'2024/2025',
		'2025/2026',
	],
	setSchoolYear: (schoolYear: string) => {
		set({
			schoolYear,
		})

		get().fetchBindings()
		get().fetchLessons()
	},

	organization: null,
	fetchOrganization: async () => {
		try {
			const response = await axios.get(API_URL + '/organizations', {
				withCredentials: true,
			})

			if (response.data.message === 'No organization') {
				set({
					organization: null,
				})

				return
			}

			set({
				organization: response.data,
			})
		} catch (err) {
			if (axios.isAxiosError(err)) {
				console.log(err.response?.data.message)
				set({
					errorMessage: err.response?.data.message,
				})
			} else {
				console.log(err)
			}
		}
	},

	createOrganization: async (name) => {
		try {
			const response = await axios.post(API_URL + '/organizations', {
				name,
			})
			get().fetchOrganization()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes(
						'Invalid `prisma.organization.create()` invocation:'
					)
				) {
					set({
						errorMessage: 'Organization name is already taken',
					})
				} else {
					console.log(err.response?.data.message)
					set({
						errorMessage: err.response?.data.message,
					})
				}
			} else {
				console.log(err)
			}
		}
	},

	leaveOrganization: async () => {
		const response = await axios.patch(API_URL + '/organizations')

		get().fetchOrganization()
	},

	inviteMemberToOrganization: async (recipientEmail, orgId) => {
		try {
			const response = await axios.post(API_URL + '/invites/new', {
				recipientEmail,
				orgId,
			})
			get().fetchOrganization()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes('invalid_string')
				) {
					set({
						errorMessage: 'Invalid email address',
					})
				} else {
					console.log(err.response?.data.message)
					set({
						errorMessage: err.response?.data.message,
					})
				}
			} else {
				console.log(err)
			}
		}
	},

	teachers: [],
	fetchTeachers: async (showLoading = false) => {
		try {
			if (showLoading) set({ teachersLoading: true })

			const mode = get().mode
			const response = await axios.get(API_URL + '/teachers', {
				withCredentials: true,
				params: {
					mode,
				},
			})

			set({
				teachers: response.data,
				teachersLoading: false,
			})
		} catch (err) {
			set({
				teachersLoading: false,
			})
			console.log(err)
		}
	},

	subjects: [],
	fetchSubjects: async (showLoading = false) => {
		try {
			if (showLoading) set({ subjectsLoading: true })

			const mode = get().mode
			const response = await axios.get(API_URL + '/subjects', {
				withCredentials: true,
				params: {
					mode,
				},
			})

			set({
				subjects: response.data,
				subjectsLoading: false,
			})
		} catch (err) {
			set({
				subjectsLoading: false,
			})
			console.log(err)
		}
	},

	classes: [],
	fetchClasses: async (showLoading = false) => {
		try {
			if (showLoading) set({ classesLoading: true })

			const mode = get().mode
			const response = await axios.get(API_URL + '/classes', {
				withCredentials: true,
				params: {
					mode,
				},
			})

			set({
				classes: response.data,
				classesLoading: false,
			})
		} catch (err) {
			set({
				classesLoading: false,
			})
			console.log(err)
		}
	},

	bindings: [],
	fetchBindings: async (showLoading = false) => {
		try {
			if (showLoading) set({ bindingsLoading: true })

			const mode = get().mode
			const schoolYear = get().schoolYear
			const response = await axios.get(API_URL + '/bindings', {
				withCredentials: true,
				params: {
					mode,
					schoolYear,
				},
			})

			set({
				bindings: response.data,
				bindingsLoading: false,
			})
		} catch (err) {
			set({
				bindingsLoading: false,
			})
			console.log(err)
		}
	},

	addBinding: async (teacherId, subjectId, classId) => {
		const mode = get().mode
		const schoolYear = get().schoolYear
		const response = await axios.put(API_URL + '/bindings', {
			teacherId,
			subjectId,
			classId,
			mode,
			schoolYear,
		})

		get().fetchBindings()
	},

	deleteBinding: async (id) => {
		const response = await axios.delete(API_URL + '/bindings', {
			data: {
				id,
			},
		})

		get().fetchBindings()
	},

	deleteTeacherFromBinding: async (bindingId, teacherId) => {
		const response = await axios.delete(
			API_URL + '/bindings/teachers',
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
			API_URL + '/bindings/teachers',
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
			API_URL + '/bindings/lessonsCount',
			{
				bindingId,
				teacherId,
				operation,
			}
		)

		get().fetchBindings()
	},

	copyBindings: async (srcClassId, destClassId) => {
		// TODO

		set({
			errorMessage: 'This feature is not implemented yet',
		})
	},

	copyLessons: async (srcClassId, destClassId) => {
		// TODO

		set({
			errorMessage: 'This feature is not implemented yet',
		})
	},

	addTeacher: async (name, shortname, email) => {
		try {
			const mode = get().mode
			const response = await axios.put(API_URL + '/teachers', {
				name,
				shortname,
				email,
				mode,
			})

			get().fetchTeachers()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes(
						'Invalid `prisma.teacher.create()` invocation:'
					)
				) {
					set({
						errorMessage:
							'Name, shortname or email already exists',
					})
					return
				}
				console.log(err.response?.data.message)
				set({
					errorMessage: err.response?.data.message,
				})
			} else {
				console.log(err)
			}
		}
	},

	removeTeacher: async (id) => {
		try {
			const response = await axios.delete(API_URL + '/teachers', {
				data: {
					id,
				},
			})

			get().fetchTeachers()
			get().fetchBindings()
			get().fetchLessons()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes(
						'Invalid `prisma.teacher.delete()` invocation:'
					)
				) {
					set({
						errorMessage: 'Teacher is assigned to a class',
					})
				} else {
					console.log(err.response?.data.message)
					set({
						errorMessage: err.response?.data.message,
					})
				}
			} else {
				console.log(err)
			}
		}
	},

	updateTeacher: async (id, name, shortname, email) => {
		try {
			const response = await axios.patch(API_URL + '/teachers', {
				id,
				name,
				shortname,
				email,
			})

			get().fetchTeachers()
			get().fetchBindings()
			get().fetchLessons()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes(
						'Invalid `prisma.teacher.update()` invocation:'
					)
				) {
					set({
						errorMessage:
							'Name, shortname or email already exists',
					})
				} else if (
					err.response?.data.message.includes('invalid_string')
				) {
					set({
						errorMessage: 'Invalid email, name or shortname',
					})
				} else {
					console.log(err.response?.data.message)
					set({
						errorMessage: err.response?.data.message,
					})
				}
			} else {
				console.log(err)
			}
		}
	},

	addClass: async (name, grade, teacherId) => {
		try {
			const mode = get().mode
			const response = await axios.put(API_URL + '/classes', {
				name,
				grade,
				teacherId,
				mode,
			})

			get().fetchClasses()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes(
						'nvalid `prisma.class.create()` invocation:'
					)
				) {
					set({
						errorMessage: 'Name or class teacher is taken',
					})
				} else {
					console.log(err.response?.data.message)
					set({
						errorMessage: err.response?.data.message,
					})
				}
			} else {
				console.log(err)
			}
		}
	},

	removeClass: async (id) => {
		try {
			const response = await axios.delete(API_URL + '/classes', {
				data: {
					id,
				},
			})

			get().fetchClasses()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes(
						'Invalid `prisma.class.delete()` invocation:'
					)
				) {
					set({
						errorMessage:
							'Class has assigned bindings or lessons',
					})
				} else {
					console.log(err.response?.data.message)
					set({
						errorMessage: err.response?.data.message,
					})
				}
			} else {
				console.log(err)
			}
		}
	},

	updateClass: async (id, name, grade, teacherId) => {
		try {
			const response = await axios.patch(API_URL + '/classes', {
				id,
				name,
				grade,
				teacherId,
			})

			get().fetchClasses()
			get().fetchBindings()
			get().fetchLessons()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes(
						'Invalid `prisma.class.update()` invocation:'
					)
				) {
					set({
						errorMessage: 'Name or class teacher is taken',
					})
				} else {
					console.log(err.response?.data.message)
					set({
						errorMessage: err.response?.data.message,
					})
				}
			} else {
				console.log(err)
			}
		}
	},

	addSubject: async (name, shortname, commiteeId) => {
		try {
			const mode = get().mode
			const response = await axios.put(API_URL + '/subjects', {
				name,
				shortname,
				commiteeId,
				mode,
			})

			get().fetchSubjects()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes(
						'Invalid `prisma.subject.create()` invocation:'
					)
				) {
					set({
						errorMessage: 'Name or shortname is already taken',
					})
				} else {
					console.log(err.response?.data.message)
					set({
						errorMessage: err.response?.data.message,
					})
				}
			} else {
				console.log(err)
			}
		}
	},

	updateSubject: async (id, name, shortname, commiteeId) => {
		try {
			const response = await axios.patch(API_URL + '/subjects', {
				id,
				name,
				shortname,
				commiteeId,
			})

			get().fetchSubjects()
			get().fetchBindings()
			get().fetchLessons()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes(
						'Invalid `prisma.subject.update()` invocation:'
					)
				) {
					set({
						errorMessage: 'Name or shortname is already taken',
					})
				} else {
					console.log(err.response?.data.message)
					set({
						errorMessage: err.response?.data.message,
					})
				}
			} else {
				console.log(err)
			}
		}
	},

	removeSubject: async (id) => {
		try {
			const response = await axios.delete(API_URL + '/subjects', {
				data: {
					id,
				},
			})

			get().fetchSubjects()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data.message.includes(
						'Invalid `prisma.subject.delete()` invocation:'
					)
				) {
					set({
						errorMessage:
							'Subject has active bindings or lessons',
					})
				} else {
					console.log(err.response?.data.message)
					set({
						errorMessage: err.response?.data.message,
					})
				}
			} else {
				console.log(err)
			}
		}
	},

	rawTableData: [],

	fetchLessons: async (showLoading = false) => {
		try {
			if (showLoading) set({ lessonsLoading: true })

			const mode = get().mode
			const schoolYear = get().schoolYear
			const response = await axios.get(API_URL + '/lessons', {
				withCredentials: true,
				params: {
					mode,
					schoolYear,
				},
			})

			set({
				rawTableData: response.data,
				lessonsLoading: false,
			})
		} catch (err) {
			set({
				lessonsLoading: false,
			})
			console.log(err)
		}
	},

	addLesson: async (classId, subjectId, day, period) => {
		const mode = get().mode
		const schoolYear = get().schoolYear
		const response = await axios.put(API_URL + '/lessons', {
			classId,
			subjectId,
			day,
			period,
			mode,
			schoolYear,
		})

		get().fetchLessons()
	},

	removeLesson: async (id) => {
		const response = await axios.delete(API_URL + '/lessons', {
			data: {
				id,
			},
		})

		get().fetchLessons()
	},

	updateLesson: async (id, teacherId, subjectId) => {
		if (subjectId && teacherId) {
			const response = await axios.patch(API_URL + '/lessons', {
				id,
				subjectId,
				teacherId,
			})

			get().fetchLessons()
		} else if (subjectId && !teacherId) {
			const response = await axios.patch(API_URL + '/lessons', {
				id,
				subjectId,
			})

			get().fetchLessons()
		} else if (!subjectId && teacherId) {
			const response = await axios.patch(API_URL + '/lessons', {
				id,
				teacherId,
			})

			get().fetchLessons()
		} else {
			console.log('No data to update')
			return
		}
	},

	sendBindings: async () => {
		try {
			const mode = get().mode
			const schoolYear = get().schoolYear

			const response = await axios.post(API_URL + '/bindings/send', {
				mode,
				schoolYear,
			})
		} catch (err) {
			if (axios.isAxiosError(err)) {
				console.log(err.response?.data.message)
				set({
					errorMessage: err.response?.data.message,
				})
			} else {
				console.log(err)
			}
		}
	},

	teachersLoading: false,
	subjectsLoading: false,
	classesLoading: false,
	bindingsLoading: false,
	lessonsLoading: false,

	selectedClass: 1,
	setSelectedClass: (classId) => set(() => ({ selectedClass: classId })),

	selectedGrade: 1,
	setSelectedGrade: (grade) => set(() => ({ selectedGrade: grade })),

	errorMessage: '',
	resetErrorMessage: () => set(() => ({ errorMessage: '' })),

	alertMessage: {
		message: '',
		status: undefined,
	},
	setAlertMessage: (message, status) =>
		set(() => ({
			alertMessage: {
				message,
				status,
			},
		})),
	resetAlertMessage: () =>
		set(() => ({ alertMessage: { message: '', status: undefined } })),
}))

useTimetableStore.getState().fetchTeachers(true)
useTimetableStore.getState().fetchSubjects(true)
useTimetableStore.getState().fetchClasses(true)
useTimetableStore.getState().fetchBindings(true)
useTimetableStore.getState().fetchLessons(true)
useTimetableStore.getState().fetchOrganization()

export default useTimetableStore
