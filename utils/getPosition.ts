export function getPosition(i: number, ci: number) {
	if ((i + 1).toString().length === 1) {
		return parseInt(`${(ci + 1).toString()}0${(i + 1).toString()}`)
	} else {
		return parseInt(`${(ci + 1).toString()}${(i + 1).toString()}`)
	}
}
