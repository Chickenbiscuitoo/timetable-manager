import { prisma } from '../server/client'

const teachers = [
	{
		name: 'John Doe',
		shortname: 'JD',
		email: 'john.doe@gmail.com',
	},
	{
		name: 'Francis Muller',
		shortname: 'FM',
		email: 'francis.muller@gmail.com',
	},
	{
		name: 'Gulami Bete',
		shortname: 'GB',
		email: 'gulami.bete@gmail.com',
	},
	{
		name: 'Xavier Dufour',
		shortname: 'XD',
		email: 'xavier.dufour@gmail.com',
	},
	{
		name: 'Yannick Gagnon',
		shortname: 'YG',
		email: 'yannic.gagnon@gmail.com',
	},
	{
		name: 'Zachary Gagnon',
		shortname: 'ZG',
		email: 'zachary.gagnon@gmail.com',
	},
	{
		name: 'Francisco Taveras',
		shortname: 'FT',
		email: 'francisco.taveras@gmail.com',
	},
	{
		name: 'Ivan Nunez',
		shortname: 'IN',
		email: 'ivan.nunez@gmail.com',
	},
	{
		name: 'Juan Perez',
		shortname: 'JP',
		email: 'juan.perez@gmail.com',
	},
	{
		name: 'Marshall Miller',
		shortname: 'MM',
		email: 'marshall.miller@gmail.com',
	},
	{
		name: 'Miguel Rodriguez',
		shortname: 'MR',
		email: 'miguel.rodriquez@gmail.com',
	},
	{
		name: 'Nathan Smith',
		shortname: 'NS',
		email: 'nathan.smith@gmail.com',
	},
	{
		name: 'Ricardo Martinez',
		shortname: 'RM',
		email: 'ricardo.martinez@gmail.com',
	},
]

const subjects = [
	{ name: 'English', shortname: 'ENG', commiteeId: 2 },
	{ name: 'History', shortname: 'HIS', commiteeId: 1 },
	{ name: 'Geography', shortname: 'GEO', commiteeId: 1 },
	{ name: 'Physics', shortname: 'PHY', commiteeId: 1 },
	{ name: 'Spanish', shortname: 'SPA', commiteeId: 2 },
	{ name: 'Chemistry', shortname: 'CHE', commiteeId: 1 },
	{ name: 'Italian', shortname: 'ITA', commiteeId: 2 },
	{ name: 'Math', shortname: 'MAT', commiteeId: 1 },
]

const classes = [
	{ name: '1.A', teacherId: 1, grade: 1 },
	{ name: '1.B', teacherId: 2, grade: 1 },
	{ name: '1.C', teacherId: 3, grade: 1 },
	{ name: '1.D', teacherId: 4, grade: 1 },

	{ name: '2.A', teacherId: 5, grade: 2 },
	{ name: '2.B', teacherId: 6, grade: 2 },
	{ name: '2.C', teacherId: 7, grade: 2 },
	{ name: '2.D', teacherId: 8, grade: 2 },

	{ name: '3.A', teacherId: 9, grade: 3 },
	{ name: '3.B', teacherId: 10, grade: 3 },
	{ name: '3.C', teacherId: 11, grade: 3 },
	{ name: '3.D', teacherId: 12, grade: 3 },
]

const commitees = [
	{
		name: 'Commitee 1',
		chairmanId: 1,
	},
	{
		name: 'Commitee 2',
		chairmanId: 2,
	},
]

async function main() {
	const data = await prisma.binding.findMany({})

	console.log(JSON.parse(JSON.stringify(data)))
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
