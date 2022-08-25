// function to turn 2D array into a simple array
export const flatten = (arr: any) =>
	arr.reduce(
		(flat: any, next: any) =>
			flat.concat(Array.isArray(next) ? flatten(next) : next),
		[]
	)
