export function getPosition(i: number, ci: number) {
	if ((i + 1).toString().length === 1) {
		return parseInt(`${(ci + 1).toString()}0${(i + 1).toString()}`)
	} else {
		return parseInt(`${(ci + 1).toString()}${(i + 1).toString()}`)
	}
}

export function getDayFromPosition(position: number) {
	return parseInt(Array.from(position.toString())[0])
}

export function getPeriodFromPosition(position: number) {
	// 102, 311, 210
	if (Array.from(position.toString())[1] === '0') {
		return parseInt(position.toString().slice(-1))
	} else {
		return parseInt(position.toString().slice(-2))
	}
}
