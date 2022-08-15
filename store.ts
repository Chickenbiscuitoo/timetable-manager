import create from 'zustand'

interface TimetableState {
	timetableData: {
		lesson_id: number
		subject: string
		teacher: string
	}[]
}

const useTimetableStore = create<TimetableState>(() => ({
	timetableData: [
		{
			lesson_id: 101,
			subject: 'PCI',
			teacher: 'RP',
		},
		{
			lesson_id: 102,
			subject: 'PCI',
			teacher: 'RP',
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
		},
		{
			lesson_id: 511,
			subject: 'PCI',
			teacher: 'RP',
		},
	],
}))

export default useTimetableStore
