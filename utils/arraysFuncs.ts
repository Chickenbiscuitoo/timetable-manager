import { Class } from '@prisma/client'

// function to turn 2D array into a simple array
export const flatten = (arr: any) =>
	arr.reduce(
		(flat: any, next: any) =>
			flat.concat(Array.isArray(next) ? flatten(next) : next),
		[]
	)

// function to sort array of classes by name
export function classesSort(a: Class, b: Class) {
	if (a.grade < b.grade) {
		return -1
	} else if (a.grade > b.grade) {
		return 1
	} else if (a.grade === b.grade) {
		if (
			a.name.charAt(a.name.length - 1) <
			b.name.charAt(b.name.length - 1)
		) {
			return -1
		} else if (
			a.name.charAt(a.name.length - 1) >
			b.name.charAt(b.name.length - 1)
		) {
			return 1
		}
	}

	return 0
}
