import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	const lessons = await prisma.subject.findMany({})
	console.log(JSON.parse(JSON.stringify(lessons)))
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
