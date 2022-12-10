import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	const data = await prisma.binding.findMany({
		include: {
			teachers: true,
			class: true,
			subject: true,
			BindingTeacherLessons: true,
		},
	})

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
