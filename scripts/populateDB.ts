import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	await prisma.lesson.create({
		data: {
			class: 10,
			subjects: { connect: { id: 5 } },
			teachers: { connect: [{ id: 9 }, { id: 6 }] },
			day: 4,
			period: 11,
		},
	})
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
