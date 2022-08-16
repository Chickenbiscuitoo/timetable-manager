import create from 'zustand'

interface TimetableState {
	rawTableData: {
		lesson_id: number
		subject: string
		teacher: string
	}[]

	addLesson: (lessonId: number, subject: string, teacher: string) => void
}

const useTimetableStore = create<TimetableState>((set) => ({
	rawTableData: [
		{
			lesson_id: 101,
			subject: 'PCI',
			teacher: 'RP',
			day: 'Monday',
			lesson: '1',
		},
		{
			lesson_id: 102,
			subject: 'PCI',
			teacher: 'RP',
			day: 'Monday',
			lesson: '2',
		},
		{
			lesson_id: 104,
			subject: 'PCI',
			teacher: 'RP',
		},
		{
			lesson_id: 201,
			subject: 'PCI',
			teacher: 'RP',
		},
		{
			lesson_id: 203,
			subject: 'PCI',
			teacher: 'RP',
		},
		{
			lesson_id: 211,
			subject: 'PCI',
			teacher: 'RP',
		},
		{
			lesson_id: 301,
			subject: 'PCI',
			teacher: 'RP',
		},
		{
			lesson_id: 401,
			subject: 'PCI',
			teacher: 'RP',
		},
		{
			lesson_id: 501,
			subject: 'PCI',
			teacher: 'RP',
			day: 'Friday',
			lesson: '1',
		},
		{
			lesson_id: 511,
			subject: 'PCI',
			teacher: 'RP',
			day: 'Friday',
			lesson: '11',
		},
		{
			lesson_id: 308,
			subject: 'FYZ',
			teacher: 'PL',
		},
	],

	addLesson: (lesson_id, subject, teacher) =>
		set((state) => ({
			rawTableData: [
				...state.rawTableData,
				{
					lesson_id,
					subject,
					teacher,
				},
			],
		})),
}))

export default useTimetableStore
