import create from 'zustand'

interface TimetableState {
	rawTableData: {
		lesson_id: number
		subject: string
		teacher: string
	}[]
	teachers: {
		name: string
		shortName: string
	}[]
	subjects: {
		name: string
		shortName: string
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
	teachers: [
		{
			name: 'Gulami Bete',
			shortName: 'GB',
			id: 1,
		},
		{
			name: 'Jan Kohut',
			shortName: 'JK',
			id: 2,
		},
		{
			name: 'Gut Recht',
			shortName: 'GR',
			id: 3,
		},
		{
			name: 'Peter Hruska',
			shortName: 'PK',
			id: 4,
		},
		{
			name: 'Marek Mrkva',
			shortName: 'GB',
			id: 5,
		},
		{
			name: 'Gulami Bete',
			shortName: 'GH',
			id: 6,
		},
		{
			name: 'Jan Kohut',
			shortName: 'HG',
			id: 7,
		},
		{
			name: 'Gut Recht',
			shortName: 'DM',
			id: 8,
		},
		{
			name: 'Peter Hruska',
			shortName: 'VP',
			id: 9,
		},
		{
			name: 'Marek Mrkva',
			shortName: 'GG',
			id: 10,
		},
	],
	subjects: [
		{
			name: 'Siete',
			shortName: 'PCI',
		},
		{
			name: 'Fyzika',
			shortName: 'FYZ',
		},
		{
			name: 'Matematika',
			shortName: 'MAT',
		},
		{
			name: 'Chemia',
			shortName: 'CHE',
		},
		{
			name: 'Biologia',
			shortName: 'BIO',
		},
		{
			name: 'Siete',
			shortName: 'PCI',
		},
		{
			name: 'Fyzika',
			shortName: 'FYZ',
		},
		{
			name: 'Matematika',
			shortName: 'MAT',
		},
		{
			name: 'Chemia',
			shortName: 'CHE',
		},
		{
			name: 'Biologia',
			shortName: 'BIO',
		},
		{
			name: 'Siete',
			shortName: 'PCI',
		},
		{
			name: 'Fyzika',
			shortName: 'FYZ',
		},
		{
			name: 'Matematika',
			shortName: 'MAT',
		},
		{
			name: 'Chemia',
			shortName: 'CHE',
		},
		{
			name: 'Biologia',
			shortName: 'BIO',
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
