import axios, { AxiosError } from 'axios'

import create from 'zustand'

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

	copyBindings: (srcClassId: number, destClassId: number) => void

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

	fetchLessons: () => void

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

	selectedClass: number
	setSelectedClass: (classId: number) => void

	selectedGrade: number
	setSelectedGrade: (grade: number) => void

	errorMessage: string
	resetErrorMessage: () => void
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

		get().fetchOrganization()
		get().fetchTeachers()
		get().fetchSubjects()
		get().fetchClasses()
		get().fetchBindings()
		get().fetchLessons()
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
			const response = await axios.get(
				'http://localhost:3000/api/organizations'
			)

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
			const response = await axios.post(
				'http://localhost:3000/api/organizations',
				{
					name,
				}
			)
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
		const response = await axios.patch(
			'http://localhost:3000/api/organizations'
		)

		get().fetchOrganization()
	},

	inviteMemberToOrganization: async (recipientEmail, orgId) => {
		try {
			const response = await axios.post(
				'http://localhost:3000/api/invites/new',
				{
					recipientEmail,
					orgId,
				}
			)
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
	fetchTeachers: async () => {
		const mode = get().mode
		const response = await axios.get(
			'http://localhost:3000/api/teachers',
			{
				params: {
					mode,
				},
			}
		)

		set({
			teachers: response.data,
		})
	},

	subjects: [],
	fetchSubjects: async () => {
		const mode = get().mode
		const response = await axios.get(
			'http://localhost:3000/api/subjects',
			{
				params: {
					mode,
				},
			}
		)

		set({
			subjects: response.data,
		})
	},

	classes: [],
	fetchClasses: async () => {
		const mode = get().mode
		const response = await axios.get(
			'http://localhost:3000/api/classes',
			{
				params: {
					mode,
				},
			}
		)

		set({
			classes: response.data,
		})
	},

	bindings: [],
	fetchBindings: async () => {
		const mode = get().mode
		const schoolYear = get().schoolYear
		const response = await axios.get(
			'http://localhost:3000/api/bindings',
			{
				params: {
					mode,
					schoolYear,
				},
			}
		)

		set({
			bindings: response.data,
		})
	},

	addBinding: async (teacherId, subjectId, classId) => {
		const mode = get().mode
		const schoolYear = get().schoolYear
		const response = await axios.put(
			'http://localhost:3000/api/bindings',
			{
				teacherId,
				subjectId,
				classId,
				mode,
				schoolYear,
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

	copyBindings: async (srcClassId, destClassId) => {
		// const response = await axios.patch(
		// 	'http://localhost:3000/api/bindings/copy',
		// 	{
		// 		srcClassId,
		// 		destClassId,
		// 	}
		// )
		// get().fetchBindings()
	},

	addTeacher: async (name, shortname, email) => {
		try {
			const mode = get().mode
			const response = await axios.put(
				'http://localhost:3000/api/teachers',
				{
					name,
					shortname,
					email,
					mode,
				}
			)

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
			const response = await axios.delete(
				'http://localhost:3000/api/teachers',
				{
					data: {
						id,
					},
				}
			)

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
			const response = await axios.put(
				'http://localhost:3000/api/classes',
				{
					name,
					grade,
					teacherId,
					mode,
				}
			)

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
			const response = await axios.delete(
				'http://localhost:3000/api/classes',
				{
					data: {
						id,
					},
				}
			)

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
			const response = await axios.put(
				'http://localhost:3000/api/subjects',
				{
					name,
					shortname,
					commiteeId,
					mode,
				}
			)

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
			const response = await axios.delete(
				'http://localhost:3000/api/subjects',
				{
					data: {
						id,
					},
				}
			)

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

	fetchLessons: async () => {
		const mode = get().mode
		const schoolYear = get().schoolYear
		const response = await axios.get(
			'http://localhost:3000/api/lessons',
			{
				params: {
					mode,
					schoolYear,
				},
			}
		)

		set(() => ({ rawTableData: response.data }))
	},

	addLesson: async (classId, subjectId, day, period) => {
		const mode = get().mode
		const schoolYear = get().schoolYear
		const response = await axios.put(
			'http://localhost:3000/api/lessons',
			{
				classId,
				subjectId,
				day,
				period,
				mode,
				schoolYear,
			}
		)

		get().fetchLessons()
	},

	removeLesson: async (id) => {
		const response = await axios.delete(
			'http://localhost:3000/api/lessons',
			{
				data: {
					id,
				},
			}
		)

		get().fetchLessons()
	},

	updateLesson: async (id, teacherId, subjectId) => {
		if (subjectId && teacherId) {
			const response = await axios.patch(
				'http://localhost:3000/api/lessons',
				{
					id,
					subjectId,
					teacherId,
				}
			)

			get().fetchLessons()
		} else if (subjectId && !teacherId) {
			const response = await axios.patch(
				'http://localhost:3000/api/lessons',
				{
					id,
					subjectId,
				}
			)

			get().fetchLessons()
		} else if (!subjectId && teacherId) {
			const response = await axios.patch(
				'http://localhost:3000/api/lessons',
				{
					id,
					teacherId,
				}
			)

			get().fetchLessons()
		} else {
			console.log('No data to update')
			return
		}
	},

	selectedClass: 1,
	setSelectedClass: (classId) => set(() => ({ selectedClass: classId })),

	selectedGrade: 1,
	setSelectedGrade: (grade) => set(() => ({ selectedGrade: grade })),

	errorMessage: '',
	resetErrorMessage: () => set(() => ({ errorMessage: '' })),
}))

useTimetableStore.getState().fetchOrganization()
useTimetableStore.getState().fetchTeachers()
useTimetableStore.getState().fetchSubjects()
useTimetableStore.getState().fetchClasses()
useTimetableStore.getState().fetchBindings()
useTimetableStore.getState().fetchLessons()

export default useTimetableStore
